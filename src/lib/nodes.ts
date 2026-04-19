export type NodeData = {
    id: string;
    label: string;      // e.g. "NODE_01"
    title: string;      // e.g. "About"
    description: string;
    route: string;      // "/about"
    position: [number, number, number];
  };
  
  export const NODES: NodeData[] = [
    {
      id: "about",
      label: "NODE_01",
      title: "About",
      description: "Bio, current focus, timeline.",
      route: "/about",
      position: [-6.5, 4.5, 2],
    },
    {
      id: "projects",
      label: "NODE_02",
      title: "Projects",
      description: "Shipped code and writeups.",
      route: "/projects",
      position: [7, 3.2, -2],
    },
    {
      id: "writing",
      label: "NODE_03",
      title: "Writing",
      description: "Notes from comp neuro and ML.",
      route: "/writing",
      position: [5.8, -4.2, 3],
    },
    {
      id: "cv",
      label: "NODE_04",
      title: "CV",
      description: "Publications, experience, education.",
      route: "/cv",
      position: [-6, -3.3, -2.5],
    },
    {
      id: "contact",
      label: "NODE_05",
      title: "Contact",
      description: "Email, GitHub, socials.",
      route: "/contact",
      position: [0.5, 6.5, -3],
    },
    {
      id: "now",
      label: "NODE_06",
      title: "Now",
      description: "What I'm working on this week.",
      route: "/now",
      position: [-0.3, -6, 3.5],
    },
  ];