/**
 * WCAG 2.4.1 (Bypass Blocks): visually hidden link that becomes visible on
 * keyboard focus and jumps past the header/nav to the page's <main>.
 */
const SkipToContent = () => (
  <a
    href="#main-content"
    className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-secondary focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-secondary-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
  >
    Skip to main content
  </a>
);

export default SkipToContent;
