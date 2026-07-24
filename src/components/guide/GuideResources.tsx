import { Link } from "react-router-dom";
import { CheckCircle2, Share2 } from "lucide-react";
import jessieHeadshot from "@/assets/jessie-hunter-headshot.png.asset.json";
import {
  Callout,
  StoryBox,
  ChapterHeader,
  SectionHeading,
  Paragraph,
  PlanCTAButton,
  JessieNote,
} from "./GuideComponents";

const GuideResources = () => (
  <>
    <section id="resources" className="scroll-mt-20 bg-muted/30 py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <ChapterHeader title="Resources & Additional Information" />

          <SectionHeading>Take Your Next Step</SectionHeading>
          <Callout>
            <h3 className="font-bold text-lg text-primary mt-0 mb-3">RE Pro Business Credit</h3>
            <Paragraph>
              <strong>Main Website:</strong>{" "}
              <a
                href="https://mybetterbusinesscredit.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                mybetterbusinesscredit.com
              </a>
            </Paragraph>
            <Paragraph>
              <strong>RE Pro Business Credit:</strong>{" "}
              <a
                href="https://REProBusinessCredit.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                REProBusinessCredit.com
              </a>
            </Paragraph>
            <Paragraph className="mb-0">
              <strong>Create Your Free Customized Plan:</strong>{" "}
              <Link to="/intake" className="text-primary hover:underline font-bold">
                Start Here →
              </Link>
            </Paragraph>
          </Callout>

          <SectionHeading>About the Author</SectionHeading>
          <StoryBox>
            <div className="flex flex-col sm:flex-row gap-5 sm:gap-6 items-center sm:items-start">
              <img
                src={jessieHeadshot.url}
                alt="Jessie Hunter, Founder of RE Pro Business Credit"
                loading="lazy"
                className="w-36 h-36 sm:w-40 sm:h-40 rounded-full object-cover object-top ring-4 ring-primary/20 shadow-lg bg-background flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-lg text-primary mt-0 mb-1">Jessie Hunter</h3>
                <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold mb-3">Founder, RE Pro Business Credit</p>
                <Paragraph className="mt-0">
                  Jessie Hunter is a licensed real estate broker in California and Georgia with over 15 years of experience in residential and commercial real estate.
                </Paragraph>
              </div>
            </div>
            <Paragraph>
              Like many of us, he built his business using personal credit for marketing, tech, staging, and everyday operating costs. When he finally discovered business credit, he calculated what that delay had cost him—and decided no other real estate professional should have to learn the same lesson the hard way.
            </Paragraph>
            <Paragraph>
              He became a certified partner with Credit Suite and founded RE Pro Business Credit to give residential and commercial agents and brokers a clear, practical path to business structure, financial organization, and credit capacity.
            </Paragraph>
            <JessieNote title="Why I built this">
              <p>
                My vision is simple: thousands of real estate professionals across the country running properly structured businesses with strong financial records and access to capital based on the success of those businesses. I hope you'll be one of them.
              </p>
            </JessieNote>
          </StoryBox>

          <SectionHeading>Share This Guide</SectionHeading>
          <div className="rounded-2xl bg-card border border-border p-5 md:p-6 shadow-[0_8px_18px_rgba(11,31,59,.06)]">
            <div className="flex items-start gap-3">
              <Share2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <Paragraph className="mt-0">
                  If you found this guide valuable, please share it with fellow real estate professionals.
                </Paragraph>
                <Paragraph className="mb-0">
                  Every agent and broker deserves to know that business credit exists and that there's a better way than mixing personal and business finances.
                </Paragraph>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* Back Cover */}
    <section className="bg-gradient-to-br from-secondary to-secondary/80 text-secondary-foreground py-20 md:py-28 text-center">
      <div className="container mx-auto px-4 max-w-3xl">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">Don't Wait Another 10 Years</h2>
        <p className="text-lg md:text-xl text-secondary-foreground/80 max-w-xl mx-auto leading-relaxed">
          Business credit exists. It's accessible. It can protect your financial future.
        </p>
        <p className="text-lg md:text-xl text-secondary-foreground/80 max-w-xl mx-auto leading-relaxed mt-4">
          The only question is: Will you take action now, or will you wait—and pay the hidden costs for years to come?
        </p>

        <div className="mt-10 rounded-2xl bg-primary/10 border-2 border-primary p-6 md:p-8">
          <p className="text-xs uppercase tracking-widest text-primary font-bold mb-4">
            Your 3-Step Path
          </p>
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="rounded-xl bg-secondary/40 border border-white/10 p-4">
              <p className="text-xs uppercase tracking-widest text-primary font-bold mb-1">Step 1</p>
              <p className="font-bold text-secondary-foreground flex items-center gap-2 m-0">
                <CheckCircle2 className="h-4 w-4 text-primary" /> Read the Guide
              </p>
            </div>
            <div className="rounded-xl bg-secondary/40 border border-white/10 p-4">
              <p className="text-xs uppercase tracking-widest text-primary font-bold mb-1">Step 2</p>
              <p className="font-bold text-secondary-foreground m-0">Create Your Free Plan</p>
            </div>
            <div className="rounded-xl bg-secondary/40 border border-white/10 p-4">
              <p className="text-xs uppercase tracking-widest text-primary font-bold mb-1">Step 3</p>
              <p className="font-bold text-secondary-foreground m-0">Choose Your Implementation Path</p>
            </div>
          </div>
          <div className="flex justify-center">
            <PlanCTAButton label="Create My Free Customized Plan" />
          </div>
          <p className="mt-4 text-sm text-secondary-foreground/70">
            Takes about 5 minutes. Lands in your no-cost RE Pro dashboard.
          </p>
        </div>

        <div className="mt-10 text-secondary-foreground/70 text-sm">
          <p><strong className="text-secondary-foreground">RE Pro Business Credit</strong></p>
          <p>Helping Real Estate Professionals Build Better Business Credit</p>
          <p className="mt-4 text-secondary-foreground/40">© 2026 REProBusinessCredit.com | All Rights Reserved</p>
        </div>
      </div>
    </section>
  </>
);

export default GuideResources;
