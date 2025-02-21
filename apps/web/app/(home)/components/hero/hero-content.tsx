export const HERO_CONTENT = {
  title: {
    line1: "You Focus on Patient Care,",
    line2: "We Focus on Operations.",
  },
  description: (
    <span>
      With deep expertise in healthcare operations, we simplify complex{" "}
      <strong>
        payment administration, health plan operations, and delegation.
      </strong>{" "}
      By streamlining workflows, reducing administrative burden, and improving
      MLR, we help you focus on what matters most—delivering better care.
    </span>
  ),
  image: {
    src: "/people-working-landing-page.png",
    alt: "Team collaborating on healthcare solutions",
    width: 400,
    height: 375,
  },
  cta: {
    primary: {
      text: "Learn More",
      href: "/services",
    },
    secondary: {
      text: "Get in Touch",
      href: "/contact",
    },
  },
} as const;
