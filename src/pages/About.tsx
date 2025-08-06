import { useEffect, useRef, useState } from "react";
import { TextScramble, typewriterEffect } from "@/lib/textEffects";
import { Button } from "@/components/ui/button";
import "../about.css";

export const About = () => {
  const datastreamRef = useRef<HTMLDivElement>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const [showDossier, setShowDossier] = useState(false);
  const [section, setSection] = useState(0);

  const personalLog =
    `I make stuff because I have to — songs, stories, games, whatever helps me make sense of things. Writing helps me sort the noise, singing reminds me I’m still here, and building worlds is how I stay connected when real life feels too far away. I'm constantly stuck somewhere between fixing myself and falling apart again. If you’re reading this, you probably get it. Stick around if you want — there’s room here for all the in-between.`;

  const originStory =
    `In the digital ruins of the old world, where servers hum with forgotten algorithms and data streams carry the echoes of lost civilizations, Lord Tsarcasm emerged—a digital bard wielding code as his weapon and music as his spell.

Born from the intersection of creativity and technology, he chronicles the tales of tomorrow through soundscapes of synthetic rebellion and melodies that remember what we've lost. His domain spans the vast networks of the Remnants universe, where factions clash and stories unfold in the shadow of fallen megacorporations.

From the deep tunnels of New Carthage to the floating cities of the H.I.V.E., his music travels through quantum networks and analog radios alike, bringing hope to settlements and haunting the nightmares of those who would rebuild the mistakes of the past.`;

  useEffect(() => {
    const run = async () => {
      if (!datastreamRef.current) return;
      const scrambler = new TextScramble(datastreamRef.current);
      await scrambler.setText("SUBJECT: LORD TSARCASM");
      await new Promise(r => setTimeout(r, 600));
      await scrambler.setText("STATUS: DECRYPTING...");
      await new Promise(r => setTimeout(r, 600));
      await scrambler.setText("ACCESS LEVEL: CLASSIFIED");
      await new Promise(r => setTimeout(r, 1000));
      datastreamRef.current.classList.add("fade-out");
      await new Promise(r => setTimeout(r, 1000));
      setShowDossier(true);
    };
    run();
  }, []);

  useEffect(() => {
    if (showDossier) {
      setTimeout(() => setSection(1), 300);
      setTimeout(() => setSection(2), 800);
      setTimeout(() => setSection(3), 1300);
      setTimeout(() => {
        setSection(4);
        if (logRef.current) {
          typewriterEffect(logRef.current, personalLog);
        }
      }, 1800);
      setTimeout(() => setSection(5), 2400);
      setTimeout(() => setSection(6), 3000);
      setTimeout(() => setSection(7), 3600);
    }
  }, [showDossier]);

  return (
    <div className="relative mx-auto max-w-3xl px-4 pt-8">
      <div id="datastream" ref={datastreamRef}></div>
      {!showDossier && <div className="progress-bar" />}
      {showDossier && (
        <div className={`dossier-container ${showDossier ? "visible" : ""} space-y-6`}>
          <h2 className="title-text glow-text text-center mb-4">CLASSIFIED DOSSIER</h2>

          <section className={`dossier-section ${section >= 1 ? "visible" : ""}`}>
            <h3 className="terminal-text text-primary mb-2">IDENTITY ASSESSMENT</h3>
            <div className="dossier-item">PRIMARY ALIAS: LORD TSARCASM</div>
            <div className="dossier-item">
              LEGAL NAME: <span className="redacted" data-name="Anton Vasilyev">[REDACTED]</span>
            </div>
            <div className="dossier-item">
              PSYCH PROFILE: INFJ (The Architect / The Agitator). A high-empathy core shielded by an analytical, critical shell. Prone to existential spirals and sudden bursts of creation.
            </div>
          </section>

          <section className={`dossier-section ${section >= 2 ? "visible" : ""}`}>
            <h3 className="terminal-text text-accent mb-2">OPERATIONAL DIRECTIVES</h3>
            <div className="dossier-item">PRIMARY FUNCTION: Narrative Weaver. Building worlds from code, chaos, and caffeine.</div>
            <div className="dossier-item">SECONDARY FUNCTION: Sonic Alchemist. Transmuting noise into anthems for the digital ghost.</div>
            <div className="dossier-item">TERTIARY FUNCTION: Community Conduit. Forging connections in the static between worlds.</div>
          </section>

          <section className={`dossier-section ${section >= 3 ? "visible" : ""}`}>
            <h3 className="terminal-text text-secondary-bright mb-2">CORE MATRIX (INFLUENCES)</h3>
            <div className="dossier-item font-semibold">SONIC IMPRINTS</div>
            <div className="dossier-item pl-4">- Heavy Metal</div>
            <div className="dossier-item pl-4">- Industrial</div>
            <div className="dossier-item pl-4">- Cinematic Scores</div>
            <div className="dossier-item font-semibold mt-2">LITERARY/VISUAL SCHEMA</div>
            <div className="dossier-item pl-4">- Dark Fantasy & Cyberpunk</div>
            <div className="dossier-item pl-4">- Dystopian Cinema</div>
            <div className="dossier-item pl-4">- Anime (e.g., Naruto)</div>
          </section>

          <section className={`dossier-section typewriter ${section >= 4 ? "visible" : ""}`}>
            <h3 className="terminal-text text-primary mb-2">PERSONAL LOG</h3>
            <div ref={logRef}></div>
          </section>

          <section className={`dossier-section ${section >= 5 ? "visible" : ""}`}>
            <h3 className="terminal-text text-secondary mb-2">ORIGIN STORY</h3>
            <p className="dossier-item whitespace-pre-line">{originStory}</p>
          </section>

          <section className={`dossier-section ${section >= 6 ? "visible" : ""}`}>
            <h3 className="terminal-text text-secondary mb-2">STATUS & ANOMALIES</h3>
            <div className="dossier-item">Current State: Stable, but fluctuating between focused output and system introspection.</div>
            <div className="dossier-item">Known Anomaly: 'Resting Bitch Face' (RBF) protocol is a passive default. Not indicative of internal state.</div>
            <div className="dossier-item">Central Paradox: Seeks deep connection while requiring operational solitude. A walking, talking contradiction.</div>
          </section>

          <section className={`dossier-section ${section >= 7 ? "visible" : ""}`}>
            <h3 className="terminal-text text-accent mb-2">SUPPORT</h3>
            <div className="dossier-item">
              Contribution: Your support helps fuel the creative engine. Find contribution options on the main Support tab.
            </div>
            <div className="flex gap-4 mt-2">
              <Button asChild variant="secondary">
                <a href="https://www.paypal.com/ncp/payment/4ZHFHWD5AA5F2" target="_blank" rel="noopener noreferrer">
                  Donate with PayPal
                </a>
              </Button>
              <Button asChild variant="secondary">
                <a href="https://venmo.com/u/Anton-Vasilyev-1" target="_blank" rel="noopener noreferrer">
                  Donate with Venmo
                </a>
              </Button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
};
