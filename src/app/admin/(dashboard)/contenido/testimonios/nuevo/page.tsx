import { TestimonialForm } from "../TestimonialForm";
import { createTestimonialAction } from "../actions";

export default function NewTestimonialPage() {
  return (
    <div>
      <h1 className="mb-6 font-title text-2xl font-black">Nuevo testimonio</h1>
      <TestimonialForm action={createTestimonialAction} />
    </div>
  );
}
