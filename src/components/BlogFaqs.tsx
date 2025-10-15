
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "../components/ui/accordion";


interface Faq {
    id:string,
    question: string;
    answer: string;
}

interface BlogFaqsProps {
    faqs: Faq[];
}


export default function BlogFaqs({ faqs }: BlogFaqsProps) {
    if (!faqs || faqs.length === 0) {
        return <p className="text-gray-500">No FAQs available.</p>;
    }
    return (
        <div className="w-full my-[30px]">
            {/* FAQ Label */}
            <h2 className="heading font-bold !leading-relaxed text-gray-900">
                Frequently Asked Questions
            </h2>

            {/* FAQ Accordion */}
            <Accordion type="single" collapsible className="mt-2 space-y-3 para duration-500">
                {faqs.map((faq, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                        <AccordionTrigger className='para text-black font-[400] '>{faq.question}</AccordionTrigger>
                        <AccordionContent className='para text-black font-[400]'>{faq.answer}</AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    )
}
