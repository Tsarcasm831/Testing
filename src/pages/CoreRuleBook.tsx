import { FC } from "react";

export const CoreRuleBook: FC = () => {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="space-y-4 text-center">
        <h1 className="title-text text-4xl md:text-6xl font-black glow-text">CORE RULE BOOK</h1>
        <p className="text-xl text-muted-foreground">
          The fundamental guide to surviving and thriving in the Remnants universe.
        </p>
      </div>

      <div className="cyber-border bg-card/50 p-2 rounded-lg backdrop-blur-sm">
        <iframe
          src="/Remnants_of_Destruction_Core_Rulebook.pdf"
          title="Core Rulebook"
          className="w-full h-[80vh]"
        />
      </div>
    </div>
  );
};

export default CoreRuleBook;
