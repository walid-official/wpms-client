# Backend Search Fix - Issues and Solutions

## 🔴 Problems Identified

### 1. **Text Index Missing**
MongoDB's `$text` search **requires a text index** to be created on the collection. Without it, the search will fail silently or return no results.

### 2. **Empty/Whitespace Search Not Handled**
The code doesn't properly validate empty or whitespace-only search strings.

### 3. **Text Search Limitations**
- `$text` only searches fields included in the text index
- It tokenizes search strings (splits by spaces)
- Less flexible than regex-based search

## ✅ Fixed Backend Code

### Option 1: Using Text Search (Requires Index Setup)

**First, create the text index in your MongoDB:**
```javascript
// Run this once in MongoDB shell or migration script
db.medicines.createIndex({ 
  name: "text", 
  category: "text", 
  manufacturer: "text",
  batchNumber: "text"
});
```

**Fixed Service Code:**
```javascript
export const getMedicines = async (search?: string, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;

  // Validate and normalize search
  const normalizedSearch = search?.trim();
  const hasSearch = normalizedSearch && normalizedSearch.length > 0;

  // Build query - use text search if search exists, otherwise empty query
  const query = hasSearch
    ? { $text: { $search: normalizedSearch } }
    : {};

  try {
    // One DB call using aggregate + facet
    const [result] = await MedicineModel.aggregate([
      // $text must be in $match and must be first stage
      ...(hasSearch ? [{ $match: query }] : [{ $match: {} }]),
      {
        $facet: {
          medicines: [
            { $sort: hasSearch ? { score: { $meta: "textScore" } } : { createdAt: -1 } },
            { $skip: skip },
            { $limit: limit },
            {
              $project: {
                name: 1,
                category: 1,
                price: 1,
                expiryDate: 1,
                mrp: 1,
                quantity: 1,
                batchNumber: 1,
                manufacturer: 1,
                ...(hasSearch ? { score: { $meta: "textScore" } } : {}),
              },
            },
          ],
          total: [{ $count: "count" }],
        },
      },
    ]);

    const medicines = result.medicines || [];
    const total = result.total[0]?.count || 0;

    return { medicines, total, page, limit };
  } catch (error) {
    // If text index doesn't exist, fall back to regex search
    if (error.code === 27 || error.message?.includes('text index')) {
      return getMedicinesWithRegex(normalizedSearch, page, limit);
    }
    throw error;
  }
};
```

### Option 2: Using Regex Search (More Flexible - RECOMMENDED)

**This approach doesn't require a text index and works immediately:**

```javascript
export const getMedicines = async (search?: string, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;

  // Validate and normalize search
  const normalizedSearch = search?.trim();
  const hasSearch = normalizedSearch && normalizedSearch.length > 0;

  // Build regex query for case-insensitive search across multiple fields
  let query = {};
  
  if (hasSearch) {
    // Escape special regex characters
    const escapedSearch = normalizedSearch.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const searchRegex = new RegExp(escapedSearch, 'i'); // 'i' = case-insensitive

    query = {
      $or: [
        { name: searchRegex },
        { category: searchRegex },
        { manufacturer: searchRegex },
        { batchNumber: searchRegex },
        { strength: searchRegex },
      ],
    };
  }

  try {
    // One DB call using aggregate + facet
    const [result] = await MedicineModel.aggregate([
      { $match: query },
      {
        $facet: {
          medicines: [
            { $sort: { createdAt: -1 } },
            { $skip: skip },
            { $limit: limit },
            {
              $project: {
                name: 1,
                category: 1,
                price: 1,
                expiryDate: 1,
                mrp: 1,
                quantity: 1,
                batchNumber: 1,
                manufacturer: 1,
              },
            },
          ],
          total: [{ $count: "count" }],
        },
      },
    ]);

    const medicines = result.medicines || [];
    const total = result.total[0]?.count || 0;

    return { medicines, total, page, limit };
  } catch (error) {
    console.error('Error fetching medicines:', error);
    throw error;
  }
};
```

### Option 3: Hybrid Approach (Best Performance)

**Uses text search if index exists, falls back to regex:**

```javascript
export const getMedicines = async (search?: string, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;

  // Validate and normalize search
  const normalizedSearch = search?.trim();
  const hasSearch = normalizedSearch && normalizedSearch.length > 0;

  if (!hasSearch) {
    // No search - simple query
    const [result] = await MedicineModel.aggregate([
      { $match: {} },
      {
        $facet: {
          medicines: [
            { $sort: { createdAt: -1 } },
            { $skip: skip },
            { $limit: limit },
            {
              $project: {
                name: 1,
                category: 1,
                price: 1,
                expiryDate: 1,
                mrp: 1,
                quantity: 1,
                batchNumber: 1,
                manufacturer: 1,
              },
            },
          ],
          total: [{ $count: "count" }],
        },
      },
    ]);

    return {
      medicines: result.medicines || [],
      total: result.total[0]?.count || 0,
      page,
      limit,
    };
  }

  // Try text search first (faster if index exists)
  try {
    const [result] = await MedicineModel.aggregate([
      { $match: { $text: { $search: normalizedSearch } } },
      { $addFields: { score: { $meta: "textScore" } } },
      {
        $facet: {
          medicines: [
            { $sort: { score: { $meta: "textScore" } } },
            { $skip: skip },
            { $limit: limit },
            {
              $project: {
                name: 1,
                category: 1,
                price: 1,
                expiryDate: 1,
                mrp: 1,
                quantity: 1,
                batchNumber: 1,
                manufacturer: 1,
              },
            },
          ],
          total: [{ $count: "count" }],
        },
      },
    ]);

    return {
      medicines: result.medicines || [],
      total: result.total[0]?.count || 0,
      page,
      limit,
    };
  } catch (error) {
    // Text index doesn't exist - fall back to regex
    if (error.code === 27 || error.message?.includes('text index')) {
      const escapedSearch = normalizedSearch.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const searchRegex = new RegExp(escapedSearch, 'i');

      const [result] = await MedicineModel.aggregate([
        {
          $match: {
            $or: [
              { name: searchRegex },
              { category: searchRegex },
              { manufacturer: searchRegex },
              { batchNumber: searchRegex },
              { strength: searchRegex },
            ],
          },
        },
        {
          $facet: {
            medicines: [
              { $sort: { createdAt: -1 } },
              { $skip: skip },
              { $limit: limit },
              {
                $project: {
                  name: 1,
                  category: 1,
                  price: 1,
                  expiryDate: 1,
                  mrp: 1,
                  quantity: 1,
                  batchNumber: 1,
                  manufacturer: 1,
                },
              },
            ],
            total: [{ $count: "count" }],
          },
        },
      ]);

      return {
        medicines: result.medicines || [],
        total: result.total[0]?.count || 0,
        page,
        limit,
      };
    }
    throw error;
  }
};
```

## 🔧 Controller Fix

**Also update your controller to handle edge cases:**

```javascript
export const getMedicinesController = catchAsync(async (req, res) => {
  const { search, page, limit } = req.query;

  // Validate and sanitize inputs
  const searchQuery = typeof search === 'string' ? search.trim() : undefined;
  const pageNum = Math.max(1, Number(page) || 1);
  const limitNum = Math.min(100, Math.max(1, Number(limit) || 10)); // Cap at 100

  const result = await getMedicines(searchQuery, pageNum, limitNum);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Medicines retrieved successfully",
    data: result,
  });
});
```

## 📝 Recommendations

1. **Use Option 2 (Regex)** for immediate fix - works without index setup
2. **Use Option 3 (Hybrid)** for best long-term performance
3. **Create text index** if you choose Option 1 or 3 for better performance on large datasets
4. **Add input validation** in controller to prevent invalid queries

## 🚀 Quick Fix (Copy-Paste Ready)

**Simplest solution - Regex-based search (works immediately):**

```javascript
export const getMedicines = async (search?: string, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  const normalizedSearch = search?.trim();
  const hasSearch = normalizedSearch && normalizedSearch.length > 0;

  const query = hasSearch
    ? {
        $or: [
          { name: { $regex: normalizedSearch.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), $options: 'i' } },
          { category: { $regex: normalizedSearch.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), $options: 'i' } },
          { manufacturer: { $regex: normalizedSearch.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), $options: 'i' } },
          { batchNumber: { $regex: normalizedSearch.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), $options: 'i' } },
        ],
      }
    : {};

  const [result] = await MedicineModel.aggregate([
    { $match: query },
    {
      $facet: {
        medicines: [
          { $sort: { createdAt: -1 } },
          { $skip: skip },
          { $limit: limit },
          {
            $project: {
              name: 1,
              category: 1,
              price: 1,
              expiryDate: 1,
              mrp: 1,
              quantity: 1,
              batchNumber: 1,
              manufacturer: 1,
            },
          },
        ],
        total: [{ $count: "count" }],
      },
    },
  ]);

  return {
    medicines: result.medicines || [],
    total: result.total[0]?.count || 0,
    page,
    limit,
  };
};
```
