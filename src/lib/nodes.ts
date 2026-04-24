export type NodeData = {
  id: string;
  label: string;
  title: string;
  description: string;
  route: string;
  position: [number, number, number];
};

// Fibonacci sphere distribution: maximally spreads N points on a sphere surface
function fibonacciSphere(n: number, radius: number): [number, number, number][] {
  const points: [number, number, number][] = [];
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));

  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2;
    const radiusAtY = Math.sqrt(1 - y * y);
    const theta = goldenAngle * i;
    const x = Math.cos(theta) * radiusAtY;
    const z = Math.sin(theta) * radiusAtY;
    points.push([x * radius, y * radius, z * radius]);
  }
  return points;
}

const positions = fibonacciSphere(7, 8);

export const NODES: NodeData[] = [
  {
    id: "about",
    label: "NODE_01",
    title: "About",
    description: "Who I am, in a few sentences.",
    route: "/about",
    position: positions[0],
  },
  {
    id: "experience",
    label: "NODE_02",
    title: "Experience",
    description: "Where I've worked, what I've built.",
    route: "/experience",
    position: positions[1],
  },
  {
    id: "education",
    label: "NODE_03",
    title: "Education",
    description: "Waterloo alum, CMU incoming.",
    route: "/education",
    position: positions[2],
  },
  {
    id: "research",
    label: "NODE_04",
    title: "Research",
    description: "Papers, labs, ongoing scientific work.",
    route: "/research",
    position: positions[3],
  },
  {
    id: "projects",
    label: "NODE_05",
    title: "Projects",
    description: "What I'm building right now.",
    route: "/projects",
    position: positions[4],
  },
  {
    id: "writing",
    label: "NODE_06",
    title: "Writing",
    description: "Essays, paper reviews, notes.",
    route: "/writing",
    position: positions[5],
  },
  {
    id: "contact",
    label: "NODE_07",
    title: "Contact",
    description: "Book a time or send a message.",
    route: "/contact",
    position: positions[6],
  },
];