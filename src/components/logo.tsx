import type { SVGAttributes } from "preact";

export function Logo(props: SVGAttributes<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 21.0898 24.3721"
      fill="none"
      role="img"
      aria-label="eve"
      {...props}
    >
      <path
        d="M21.0898 0H0V3.89551H21.0898V0ZM17.7744 10.1582H0V14.0537H17.7744V10.1582ZM21.0898 20.4766H0V24.3721H21.0898V20.4766Z"
        fill="currentColor"
      />
    </svg>
  );
}
