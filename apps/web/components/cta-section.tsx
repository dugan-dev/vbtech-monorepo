import { CalcomButton } from "./calcom-button";

export function CtaSection() {
  return (
    <section className="container relative flex flex-col items-center gap-6 py-20 sm:gap-10">
      <h2 className="font-heading max-w-xl text-center text-3xl font-semibold sm:text-4xl sm:leading-tight">
        Optimize Payments, Save Time, and Reduce Costs
      </h2>
      <p className="text-muted-foreground max-w-xl text-center text-lg">
        Automate your payment processes, minimize manual work, and free up
        valuable resources to focus on patient care.
      </p>
      <div>
        <CalcomButton />
      </div>
    </section>
  );
}
