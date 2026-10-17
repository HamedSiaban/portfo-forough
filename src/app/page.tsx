import { sections } from "@/config/sections";

export default function Home() {
  return (
    <main id="main-content">
      {sections.map(({ id, Component }) => (
        <Component key={id} />
      ))}
    </main>
  );
}
