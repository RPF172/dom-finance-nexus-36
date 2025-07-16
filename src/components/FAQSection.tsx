
import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "How do I purchase $DOM?",
    answer: "Once launched, $DOM will be available for purchase on major decentralized exchanges (DEXs) like Uniswap. You'll need a compatible Web3 wallet such as MetaMask. Detailed step-by-step instructions will be available in the documentation section of our website."
  },
  {
    question: "What chains will $DOM live on?",
    answer: "Initially, $DOM will launch on Ethereum (ERC-20), with plans to expand to additional chains like Polygon, BNB Chain, and Solana through cross-chain bridges to maximize accessibility and reduce gas fees."
  },
  {
    question: "How does staking yield work?",
    answer: "Staking $DOM tokens locks them into smart contracts for specified periods, generating rewards from platform fees. Higher staking amounts and longer lock periods yield increased rewards, with APYs that dynamically adjust based on total staked supply."
  },
  {
    question: "What is the governance structure?",
    answer: "The $DOM governance system follows a DAO model where token holders can propose and vote on platform changes, fee structures, and ecosystem fund allocations. Voting power is proportional to staked tokens, with a minimum staking period required for governance participation."
  },
  {
    question: "What security measures are in place?",
    answer: "All $DOM smart contracts undergo rigorous security auditing by CertiK. We implement multi-signature wallets for treasury management, time-locked contracts for major updates, and maintain a bug bounty program to reward security researchers."
  },
  {
    question: "How does $DOM integrate with existing platforms?",
    answer: "SubSpace provides API documentation and SDK libraries that enable third-party platforms to integrate $DOM payment rails, staking mechanisms, and governance features. Our ecosystem fund actively supports partners building $DOM integrations."
  }
];

const FAQSection: React.FC = () => {
  return (
    <section id="faq" className="py-24 bg-domtoken-obsidian">
      <div className="section-container max-w-4xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
          <p className="text-domtoken-silver max-w-2xl mx-auto">
            Find answers to the most common questions about $DOM token and the SubSpace ecosystem.
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="border-domtoken-slate">
              <AccordionTrigger className="text-white hover:text-domtoken-crimson text-left">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-domtoken-silver">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FAQSection;
