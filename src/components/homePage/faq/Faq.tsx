"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { HelpCircle, MessageCircle, BookOpen } from "lucide-react"

export const Faq = () => {
  const faqs = [
    {
      category: "Getting Started",
      icon: "🚀",
      items: [
        {
          question: "How do I login to the system?",
          answer:
            "Use your admin credentials (email/username and password) to login. After successful authentication, you will be automatically redirected to the homepage where you can see the 'Get Started' button.",
        },
        {
          question: "What should I do after logging in?",
          answer:
            "After login, you'll see the homepage with a 'Get Started' button. Click it to access the main dashboard which contains four main modules: Admin Panel, Sales/Billing, Stocks/Inventory, and Reports.",
        },
        {
          question: "Can multiple users access the system simultaneously?",
          answer:
            "Yes, multiple admin users can access the system. Each user needs their own login credentials to maintain security and data integrity.",
        },
      ],
    },
    {
      category: "Admin Panel",
      icon: "⚙️",
      items: [
        {
          question: "How do I add new medicines to the system?",
          answer:
            "In the Admin Panel, you can add new medicines by clicking the 'Add Medicine' button. Fill in the required details like medicine name, composition, batch number, expiry date, and MRP, then submit the form.",
        },
        {
          question: "How can I update medicine information?",
          answer:
            "Navigate to the Admin Panel, search for the medicine you want to update, select it, and click the 'Update' option. Make the necessary changes and save.",
        },
        {
          question: "What if I need to delete a medicine from the database?",
          answer:
            "Go to Admin Panel, find the medicine using the search feature, select it, and click the 'Delete' button. A confirmation dialog will appear before permanently removing it.",
        },
        {
          question: "Can I search for medicines by different criteria?",
          answer:
            "Yes, the Admin Panel has a comprehensive search feature. You can search medicines by name, batch number, or other relevant parameters for quick access.",
        },
      ],
    },
    {
      category: "Sales & Billing",
      icon: "💳",
      items: [
        {
          question: "How do I process a sale?",
          answer:
            "Go to the Sales/Billing module, search for the desired product, select it, adjust the quantity, set the MRP/sell cost, apply any discounts, add customer details (name and mobile number), and click 'Generate Bill'.",
        },
        {
          question: "How can I apply discounts to a product?",
          answer:
            "While in the Sales/Billing module, after selecting a product and adjusting quantity, you'll see a discount system on the right side. Enter the discount percentage or amount, and it will be calculated automatically.",
        },
        {
          question: "Can I modify the quantity and MRP before generating a bill?",
          answer:
            "Yes, absolutely. You can increase or decrease the product quantity and also adjust the MRP (sell cost) before generating the bill to ensure accurate billing.",
        },
        {
          question: "What information do I need from the customer to generate a bill?",
          answer:
            "You need the customer's name and mobile number. This information is required before clicking the 'Generate Bill' button to create the invoice.",
        },
        {
          question: "Can I print the generated invoice?",
          answer:
            "Yes, after generating the bill, you can print the invoice directly from the system. The invoice is generated as a PDF which you can print or save for records.",
        },
      ],
    },
    {
      category: "Inventory & Reports",
      icon: "📊",
      items: [
        {
          question: "How do I check my current stock levels?",
          answer:
            "Navigate to the Stocks/Inventory module to view all medicines and their current stock quantities. This helps you manage inventory and identify low-stock items.",
        },
        {
          question: "How can I generate reports for my business?",
          answer:
            "Go to the Reports module where you can view various business data. You can filter reports by date range to analyze sales trends and performance over specific periods.",
        },
        {
          question: "Can I view previous invoices in the system?",
          answer:
            "Yes, in the Reports module, you can access and view all previously generated invoices. You can also filter them by date to find specific transactions.",
        },
        {
          question: "What kind of data can I see in reports?",
          answer:
            "Reports provide comprehensive insights including sales data, stock movements, invoice history, and other relevant pharmacy metrics. You can filter and analyze this data by date ranges.",
        },
      ],
    },
    {
      category: "Troubleshooting",
      icon: "🔧",
      items: [
        {
          question: "I forgot my login credentials. What should I do?",
          answer:
            "Contact your system administrator to reset your credentials. For security reasons, ensure you update your password after receiving temporary credentials.",
        },
        {
          question: "Why am I unable to add a new medicine?",
          answer:
            "Ensure all required fields are filled correctly. Check that the medicine doesn't already exist in the system and verify you have admin permissions to add new entries.",
        },
        {
          question: "The bill is not generating. What could be wrong?",
          answer:
            "Verify that you have entered the customer's name and mobile number. Ensure the product quantity is correctly set and the inventory has sufficient stock for the sale.",
        },
        {
          question: "How do I know if my changes have been saved?",
          answer:
            "After making changes, you'll receive a confirmation message. Data is automatically saved when you click 'Save', 'Generate Bill', or 'Update' buttons.",
        },
      ],
    },
  ]

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-gray-50/50 dark:to-gray-900/50">
      <div className="max-w-5xl mx-auto">
        <div className="mb-16 text-center">
          <div className="inline-flex items-center justify-center mb-4">
            <span className="text-sm font-semibold tracking-[0.3em] text-blue-600 dark:text-blue-400 uppercase bg-blue-50 dark:bg-blue-950/30 px-4 py-2 rounded-full">
              Support Center
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-4">
            Frequently Asked{" "}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Questions
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Find quick answers to common questions about using the pharmacy management system
          </p>
        </div>

        <div className="space-y-6">
          {faqs.map((faqGroup, groupIndex) => (
            <Card 
              key={groupIndex} 
              className="border-2 border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <CardHeader className="relative z-10 pb-4 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-blue-950/20 dark:to-indigo-950/20">
                <div className="flex items-center gap-3">
                  <div className="text-3xl">{faqGroup.icon}</div>
                  <CardTitle className="text-xl font-bold text-blue-600 dark:text-blue-400">
                    {faqGroup.category}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="relative z-10">
                <Accordion type="single" collapsible className="w-full">
                  {faqGroup.items.map((item, itemIndex) => (
                    <AccordionItem 
                      key={itemIndex} 
                      value={`${groupIndex}-${itemIndex}`} 
                      className="border-gray-200 dark:border-gray-800"
                    >
                      <AccordionTrigger className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors py-4 font-semibold text-left">
                        <span className="text-base">{item.question}</span>
                      </AccordionTrigger>
                      <AccordionContent className="text-foreground/80 pb-4">
                        <p className="text-sm leading-relaxed pl-1">{item.answer}</p>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 grid md:grid-cols-3 gap-6">
          <Card className="border-2 border-blue-200 dark:border-blue-800 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg mb-2">Live Chat</h3>
              <p className="text-sm text-muted-foreground">Get instant help from our support team</p>
            </CardContent>
          </Card>
          
          <Card className="border-2 border-green-200 dark:border-green-800 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-green-500 text-white flex items-center justify-center mx-auto mb-4">
                <HelpCircle className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg mb-2">Help Center</h3>
              <p className="text-sm text-muted-foreground">Browse our comprehensive knowledge base</p>
            </CardContent>
          </Card>
          
          <Card className="border-2 border-purple-200 dark:border-purple-800 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-purple-500 text-white flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg mb-2">Documentation</h3>
              <p className="text-sm text-muted-foreground">Read detailed guides and tutorials</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
