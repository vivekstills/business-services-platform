import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Clock, Calendar, Tag } from 'lucide-react';

const TABLE_OF_CONTENTS = [
  { id: 'introduction', title: 'Introduction' },
  { id: 'eligibility', title: 'Eligibility Criteria' },
  { id: 'documents', title: 'Required Documents' },
  { id: 'process', title: 'Registration Process' },
  { id: 'compliance', title: 'Post-Registration Compliance' }
];

export default function ContentPage() {
  return (
    <section className="bg-[#0A0B0D] min-h-screen pt-32 pb-20 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-16">
          
          {/* Main Content Column */}
          <div className="flex-1 max-w-[680px]">
            
            {/* Article Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-12"
            >
              <div className="flex items-center gap-4 text-sm text-[#666666] mb-6 font-medium">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" /> 5 min read
                </span>
                <span className="w-1 h-1 rounded-full bg-[#333333]" />
                <span className="flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5" /> Business Registration
                </span>
                <span className="w-1 h-1 rounded-full bg-[#333333]" />
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" /> Updated Feb 2026
                </span>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold text-white leading-[1.1] tracking-tight mb-6">
                Complete Guide to Private Limited Company Registration in India
              </h1>
              
              <p className="text-xl text-[#A0A0A0] leading-relaxed font-light">
                Everything you need to know about starting a Pvt Ltd company, from eligibility and documents to the step-by-step registration process.
              </p>
            </motion.div>

            {/* Article Body */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="prose prose-invert prose-lg max-w-none"
            >
              <h2 id="introduction" className="text-3xl font-semibold text-white mt-12 mb-6 tracking-tight">
                Introduction
              </h2>
              <p className="text-[17px] leading-[1.7] text-[#A0A0A0] mb-6">
                A Private Limited Company is the most popular legal structure for businesses in India. It offers limited liability protection to its shareholders, ability to raise equity funds, and separate legal entity status. This structure is ideal for startups and growing businesses looking to scale operations.
              </p>
              
              <h2 id="eligibility" className="text-3xl font-semibold text-white mt-12 mb-6 tracking-tight">
                Eligibility Criteria
              </h2>
              <p className="text-[17px] leading-[1.7] text-[#A0A0A0] mb-6">
                Before starting the registration process, ensure you meet the following requirements:
              </p>
              <ul className="space-y-3 mb-8 ml-1">
                {[
                  "Minimum 2 Directors (at least one Indian resident)",
                  "Minimum 2 Shareholders (can be same as directors)",
                  "Registered Office Address in India",
                  "Digital Signature Certificate (DSC) for all directors"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-[17px] leading-[1.7] text-[#A0A0A0]">
                    <span className="w-1.5 h-1.5 rounded-sm bg-[#444444] mt-2.5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <h2 id="documents" className="text-3xl font-semibold text-white mt-12 mb-6 tracking-tight">
                Required Documents
              </h2>
              <p className="text-[17px] leading-[1.7] text-[#A0A0A0] mb-6">
                Documentation is a crucial part of the process. You will need to prepare the following:
              </p>
              <div className="bg-[#111111] border border-[#1A1A1A] rounded-lg p-6 mb-8">
                <h3 className="text-lg font-medium text-white mb-4">For Directors & Shareholders</h3>
                <ul className="space-y-2 mb-6">
                  <li className="text-[#A0A0A0] text-[16px]">• PAN Card (Mandatory for Indians)</li>
                  <li className="text-[#A0A0A0] text-[16px]">• Passport (Mandatory for Foreigners)</li>
                  <li className="text-[#A0A0A0] text-[16px]">• Voter ID / Driving License / Passport</li>
                  <li className="text-[#A0A0A0] text-[16px]">• Latest Bank Statement / Electricity Bill</li>
                </ul>
                <h3 className="text-lg font-medium text-white mb-4">For Registered Office</h3>
                <ul className="space-y-2">
                  <li className="text-[#A0A0A0] text-[16px]">• Latest Electricity Bill / Gas Bill</li>
                  <li className="text-[#A0A0A0] text-[16px]">• Notarized Rental Agreement (if rented)</li>
                  <li className="text-[#A0A0A0] text-[16px]">• No Objection Certificate (NOC) from owner</li>
                </ul>
              </div>

              <h2 id="process" className="text-3xl font-semibold text-white mt-12 mb-6 tracking-tight">
                Registration Process
              </h2>
              <p className="text-[17px] leading-[1.7] text-[#A0A0A0] mb-6">
                The registration process is fully online and typically takes 10-15 days. It involves obtaining DSC, name approval, and filing the SPICe+ form with the Ministry of Corporate Affairs (MCA).
              </p>
              <ol className="space-y-6 mb-8 relative border-l border-[#1A1A1A] ml-3 pl-8">
                {[
                  { title: "Step 1: Digital Signature", desc: "Obtain DSC for all proposed directors." },
                  { title: "Step 2: Name Reservation", desc: "Apply for unique name via SPICe+ Part A." },
                  { title: "Step 3: Incorporation", desc: "File SPICe+ Part B with all documents." },
                  { title: "Step 4: PAN & TAN", desc: "Auto-generated with Certificate of Incorporation." }
                ].map((step, i) => (
                  <li key={i} className="relative">
                    <span className="absolute -left-[39px] top-1.5 w-5 h-5 rounded-full bg-[#1A1A1A] border border-[#333333] flex items-center justify-center text-[10px] text-white font-medium">
                      {i + 1}
                    </span>
                    <h3 className="text-lg font-medium text-white mb-1">{step.title}</h3>
                    <p className="text-[#888888]">{step.desc}</p>
                  </li>
                ))}
              </ol>

            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-32">
              <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-6">
                On this page
              </h4>
              <ul className="space-y-3 border-l border-[#1A1A1A]">
                {TABLE_OF_CONTENTS.map((item) => (
                  <li key={item.id}>
                    <a 
                      href={`#${item.id}`}
                      className="block pl-4 text-sm text-[#666666] hover:text-white hover:border-l hover:border-white -ml-[1px] transition-colors duration-200 py-1"
                    >
                      {item.title}
                    </a>
                  </li>
                ))}
              </ul>

              <div className="mt-12 p-6 bg-[#111111] border border-[#1A1A1A] rounded-lg">
                <h4 className="text-white font-medium mb-2">Ready to start?</h4>
                <p className="text-sm text-[#888888] mb-4">
                  Register your Private Limited Company today with expert assistance.
                </p>
                <button className="w-full py-2 px-4 bg-white text-black text-sm font-medium rounded hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
                  Get Started <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
