export type ResearchProject = {
    slug: string;
    title: string;
    subtitle: string;
    lab: string;
    supervisors: string[];
    period: string;
    cluster: "compneuro" | "robotics" | "compbio";
    tags: string[];
    status: "published" | "course" | "ongoing";
    statusLabel: string;
    abstract: string;
    bullets: string[];
    links?: { label: string; href: string }[];
  };
  
  export const projects: ResearchProject[] = [
    {
      slug: "basal-ganglia-dnf",
      title: "Basal Ganglia Dynamic Neural Fields",
      subtitle: "A DNF model of Parkinsonian freezing of gait",
      lab: "Computational Neuroscience Research Group, University of Waterloo",
      supervisors: ["Dr. Jeff Orchard", "Dr. Madeleine Bartlett"],
      period: " May 2025 – Feb 2026",
      cluster: "compneuro",
      tags: ["Dynamic Neural Fields", "Basal Ganglia", "Parkinson's", "Python", "CogSci 2026"],
      status: "published",
      statusLabel: "Accepted · CogSci 2026",
      abstract:
        "We constructed a Dynamic Neural Field model of the basal ganglia to investigate the neural mechanisms underlying freezing of gait (FOG) in Parkinson's disease. The model captures the competitive dynamics between direct and indirect pathways and reproduces characteristic FOG onset under dopamine depletion, offering a mechanistic account grounded in population-level neural activity.",
      bullets: [
        "Built and tuned a population-coded DNF in Python capturing direct/indirect pathway competition in the basal ganglia under healthy vs. dopamine-depleted conditions.",
        "Reproduced empirically-observed freezing onset and release patterns; identified bistable attractor dynamics as a candidate mechanism for FOG.",
        "Accepted to the 2026 Annual Conference of the Cognitive Science Society — my first first-author conference paper.",
      ],
    },
    {
      slug: "inverse-rl-skid-steer",
      title: "Inverse RL for Risk-Aware Robot Navigation",
      subtitle: "Bayesian Optimization over cost function weights + CVaR for a skid-steer MPC controller",
      lab: "Computational Neuroscience Research Group, University of Waterloo",
      supervisors: ["Dr. Michael Furlong", "Dr. Chris Eliasmith"],
      period: "Jan 2026 – August 2026",
      cluster: "robotics",
      tags: ["Inverse RL", "Bayesian Optimization", "MPC", "CVaR", "Robotics", "Python"],
      status: "ongoing",
      statusLabel: "Research Project",
      abstract:
        "We developed an inverse reinforcement learning pipeline to recover the latent cost function and risk preferences of a risk-aware Model Predictive Controller (MPC) operating on a skid-steer robot. Rather than hand-specifying controller weights, we used Bayesian Optimization to match demonstrated trajectories — recovering both continuous cost weights and a CVaR risk parameter from expert rollouts.",
      bullets: [
        "Replaced Powell-method optimization with Bayesian Optimization (Gaussian Process surrogate + EI acquisition), dramatically improving convergence stability on high-variance objective landscapes.",
        "Redesigned the objective function to use exponential-decay trajectory distance and skid-steer inverse kinematics for control effort — more physically grounded than the original Euclidean metric.",
        "Diagnosed and fixed goal-tolerance and stuck-detection edge cases that caused spurious objective evaluations; built batch experiment runners and supervisor-facing summary decks.",
      ],
    },
    {
      slug: "dopamine-ode",
      title: "Dopamine Terminal Dynamics in Parkinson's Disease",
      subtitle: "Reproduction + extension of a biophysical ODE model of dopamine regulation",
      lab: "Applied Mathematics 382 — Computational Biology, University of Waterloo",
      supervisors: ["Course project"],
      period: "Winter 2026",
      cluster: "compbio",
      tags: ["ODE Modeling", "Dopamine", "Parkinson's", "Computational Biology", "Python", "NumPy"],
      status: "course",
      statusLabel: "Course Project · AMATH 382",
      abstract:
        "Reproduced the biophysical ODE model of dopamine synthesis, release, and reuptake from Best et al. (2009) and Reed et al. (2012), then extended it with a novel Hill-function neural gain term to capture activity-dependent modulation of dopamine dynamics. Implemented in Python with numerical integration and bifurcation analysis.",
      bullets: [
        "Faithfully reproduced published simulation results for healthy and Parkinsonian (dopamine-depleted) conditions using scipy ODE solvers, validating model behavior against reported phase plots.",
        "Introduced a Hill-function gain extension coupling neural firing rate to dopamine synthesis rate — a biologically motivated modification not present in the original papers.",
        "Prepared a full LaTeX report and academic poster; the extension produced qualitatively novel limit-cycle behavior worth exploring further.",
      ],
    },
    {
      slug: "lmu-novelty-detection",
      title: "Novelty Detection with Legendre Memory Units",
      subtitle: "Temporal memory for anomaly detection using LMUs",
      lab: "SYDE 552 — Computational Neuroscience, University of Waterloo",
      supervisors: ["Course project"],
      period: "Winter 2025",
      cluster: "compneuro",
      tags: ["LMU", "Novelty Detection", "Temporal Memory", "Computational Neuroscience", "Python"],
      status: "course",
      statusLabel: "Course Project · SYDE 552",
      abstract:
        "Investigated the use of Legendre Memory Units (LMUs) — a biologically-motivated recurrent architecture encoding continuous-time history via orthogonal Legendre polynomials — for unsupervised novelty detection in temporal sequences. LMUs' structured memory window makes them well-suited for flagging inputs that deviate from learned temporal context.",
      bullets: [
        "Implemented an LMU-based autoencoder and evaluated reconstruction error as a novelty signal on synthetic and benchmark time-series datasets.",
        "Compared LMU memory representation against standard GRU baselines; LMUs showed stronger sensitivity to distributional shift in periodic signals.",
        "Explored connections between LMU dynamics and predictive coding frameworks from computational neuroscience.",
      ],
    },
  ];
  
  export const clusterMeta = {
    compneuro: {
      label: "Computational Neuroscience",
      color: "#67e8f9", // cyan
      description: "Brain-inspired models, neural dynamics, cognitive systems",
    },
    robotics: {
      label: "Robotics & RL",
      color: "#a78bfa", // violet
      description: "Inverse RL, risk-aware control, autonomous navigation",
    },
    compbio: {
      label: "Computational Biology",
      color: "#6ee7b7", // emerald
      description: "Biophysical modeling, ODE systems, molecular dynamics",
    },
  };