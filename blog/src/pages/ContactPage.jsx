import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, MapPin, Phone } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea, Label } from "@/components/ui/form-elements";
import { Button } from "@/components/ui/button";
import { useDocumentHead } from "@/hooks/useDocumentHead";

const schema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Please enter a valid email"),
  subject: z.string().min(3, "Subject is required"),
  message: z.string().min(10, "Message should be at least 10 characters"),
});

export default function ContactPage() {
  useDocumentHead({ title: "Contact Us", description: "Get in touch with the SirPeace editorial team." });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async () => {
    // Wired to a future /contact endpoint; for now, confirms receipt locally.
    await new Promise((r) => setTimeout(r, 600));
    toast.success("Message sent! Our team will respond within 2 business days.");
    reset();
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-14">
      <h1 className="font-display text-3xl font-bold text-ink">Contact Us</h1>
      <p className="mt-2 max-w-xl text-body">Have a tip, correction, or partnership inquiry? We'd love to hear from you.</p>

      <div className="mt-10 grid grid-cols-1 gap-10 md:grid-cols-2">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" {...register("name")} />
            {errors.name && <p className="mt-1 text-xs text-breaking">{errors.name.message}</p>}
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...register("email")} />
            {errors.email && <p className="mt-1 text-xs text-breaking">{errors.email.message}</p>}
          </div>
          <div>
            <Label htmlFor="subject">Subject</Label>
            <Input id="subject" {...register("subject")} />
            {errors.subject && <p className="mt-1 text-xs text-breaking">{errors.subject.message}</p>}
          </div>
          <div>
            <Label htmlFor="message">Message</Label>
            <Textarea id="message" {...register("message")} />
            {errors.message && <p className="mt-1 text-xs text-breaking">{errors.message.message}</p>}
          </div>
          <Button type="submit" variant="accent" disabled={isSubmitting}>
            {isSubmitting ? "Sending..." : "Send message"}
          </Button>
        </form>

        <div className="space-y-5">
          <div className="flex items-start gap-3">
            <Mail size={20} className="mt-0.5 text-accent" />
            <div>
              <p className="font-semibold text-ink">Email</p>
              <p className="text-sm text-body">newsroom@sirpeace.com</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Phone size={20} className="mt-0.5 text-accent" />
            <div>
              <p className="font-semibold text-ink">Phone</p>
              <p className="text-sm text-body">+233 20 000 0000</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <MapPin size={20} className="mt-0.5 text-accent" />
            <div>
              <p className="font-semibold text-ink">Address</p>
              <p className="text-sm text-body">Accra, Ghana</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
