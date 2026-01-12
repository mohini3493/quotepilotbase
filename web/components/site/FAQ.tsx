"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { motion } from "framer-motion";

const faqs = [
  {
    q: "Is QuotePilot customizable?",
    a: "Yes, all questions and pricing rules are fully admin-configurable from the dashboard. You can customize forms, add or remove questions, and set up complex pricing rules without any coding.",
  },
  {
    q: "Can I use it for any business?",
    a: "Absolutely. QuotePilot is designed to support multiple industries and pricing models. Whether you're in construction, consulting, software, or any service-based business, you can tailor it to your needs.",
  },
  {
    q: "Is coding required?",
    a: "No coding required! Everything can be managed visually using our intuitive admin UI. Simply drag, drop, and configure your quote forms and pricing rules through the dashboard.",
  },
  {
    q: "How quickly can I get started?",
    a: "You can be up and running in minutes. Create your account, set up your first form, define your pricing rules, and start generating quotes immediately. No complex setup or installation required.",
  },
  {
    q: "Does it integrate with my existing tools?",
    a: "QuotePilot is designed to work seamlessly with your existing workflow. Export quotes to PDF, integrate with your CRM, or use our API to connect with other business tools.",
  },
  {
    q: "What kind of pricing models are supported?",
    a: "We support various pricing models including fixed pricing, tiered pricing, percentage-based calculations, conditional pricing rules, and complex formulas based on multiple variables.",
  },
  {
    q: "Is my data secure?",
    a: "Security is our top priority. All data is encrypted in transit and at rest, with regular backups and enterprise-grade security measures to protect your business information.",
  },
];

export default function FAQ() {
  return (
    <section
      id="faq"
      className="py-24 bg-gradient-to-br from-background via-muted/10 to-primary/5 font-sans"
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Heading */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Everything you need to know about QuotePilot. Can't find the answer
            you're looking for?
            <span className="text-primary hover:opacity-80 cursor-pointer font-medium">
              {" "}
              Contact our team
            </span>
            .
          </p>
        </motion.div>

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left Side - Window/Door Image */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <div
                className="w-full h-96 lg:h-[500px] bg-cover bg-center"
                style={{
                  backgroundImage:
                    "url('https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=2069&auto=format&fit=crop')",
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
            </div>

            {/* Floating Stats Card */}
            <motion.div
              className="absolute -bottom-6 -right-6 bg-white dark:bg-card p-6 rounded-xl shadow-xl border"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">24/7</div>
                <div className="text-sm text-muted-foreground">
                  Quick Answers
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Side - FAQ Accordion */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((f, index) => (
                <AccordionItem
                  key={f.q}
                  value={`faq-${index}`}
                  className="group rounded-xl border bg-card shadow-sm hover:shadow-lg transition-all duration-300"
                >
                  <AccordionTrigger className="text-left font-semibold hover:no-underline px-6 py-5 group-hover:text-primary transition-colors duration-200 text-base">
                    <div className="flex items-center space-x-3">
                      <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-primary font-bold text-xs">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                      </div>
                      <span className="flex-1">{f.q}</span>
                    </div>
                  </AccordionTrigger>

                  <AccordionContent className="text-muted-foreground leading-relaxed px-6 pb-5 pt-2 text-sm border-t">
                    <div className="pl-10">{f.a}</div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </div>

       
      </div>
    </section>
  );
}
