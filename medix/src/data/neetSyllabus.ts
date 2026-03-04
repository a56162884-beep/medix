export interface SyllabusStructure {
  [subject: string]: {
    [chapter: string]: string[];
  };
}

export const neetSyllabus: SyllabusStructure = {
  "Physics": {
    "Physics and Measurement": [
      "Units of measurements",
      "System of Units",
      "SI Units",
      "Errors in measurements",
      "Dimensions of Physics quantities",
      "Dimensional analysis"
    ],
    "Kinematics": [
      "Motion in a straight line",
      "Position-time graph",
      "Speed and velocity",
      "Uniform and non-uniform motion",
      "Relative Velocity",
      "Motion in a plane",
      "Projectile Motion",
      "Uniform Circular Motion"
    ],
    "Laws of Motion": [
      "Newton's First law of motion",
      "Newton's Second Law of motion",
      "Newton's Third Law of motion",
      "Law of conservation of linear momentum",
      "Static and Kinetic friction",
      "Dynamics of uniform circular motion"
    ],
    "Work, Energy, and Power": [
      "Work done by a constant force",
      "Kinetic and potential energies",
      "Work-energy theorem",
      "Conservation of mechanical energy",
      "Motion in a vertical circle",
      "Elastic and inelastic collisions"
    ],
    "Rotational Motion": [
      "Centre of mass",
      "Moment of a force",
      "Torque",
      "Angular momentum",
      "Moment of inertia",
      "Radius of gyration",
      "Equilibrium of rigid bodies"
    ],
    "Gravitation": [
      "Universal law of gravitation",
      "Acceleration due to gravity",
      "Kepler's law of planetary motion",
      "Gravitational potential energy",
      "Escape velocity",
      "Satellites"
    ],
    "Properties of Solids and Liquids": [
      "Elastic behaviour",
      "Hooke's Law",
      "Young's modulus",
      "Viscosity",
      "Stokes' law",
      "Bernoulli's principle",
      "Surface energy and surface tension",
      "Thermal expansion",
      "Heat transfer"
    ],
    "Thermodynamics": [
      "Thermal equilibrium",
      "Zeroth law of thermodynamics",
      "First law of thermodynamics",
      "Second law of thermodynamics",
      "Reversible and irreversible processes"
    ],
    "Kinetic Theory of Gases": [
      "Equation of state of a perfect gas",
      "Kinetic theory of gases assumptions",
      "RMS speed of gas molecules",
      "Degrees of freedom",
      "Law of equipartition of energy"
    ],
    "Oscillations and Waves": [
      "Periodic motion",
      "Simple harmonic motion (S.H.M.)",
      "Wave motion",
      "Longitudinal and transverse waves",
      "Doppler effect"
    ],
    "Electrostatics": [
      "Electric charges",
      "Coulomb's law",
      "Electric field",
      "Electric flux",
      "Gauss's law",
      "Electric potential",
      "Capacitors and capacitance"
    ],
    "Current Electricity": [
      "Electric current",
      "Ohm's law",
      "Electrical resistance",
      "Kirchhoff's laws",
      "Wheatstone bridge",
      "Metre Bridge"
    ],
    "Magnetic Effects of Current and Magnetism": [
      "Biot - Savart law",
      "Ampere's law",
      "Force on a moving charge",
      "Moving coil galvanometer",
      "Magnetic dipole",
      "Magnetic properties of materials"
    ],
    "Electromagnetic Induction and Alternating Currents": [
      "Faraday's law",
      "Lenz's Law",
      "Eddy currents",
      "Self and mutual inductance",
      "Alternating currents",
      "LCR series circuit",
      "AC generator and transformer"
    ],
    "Electromagnetic Waves": [
      "Displacement current",
      "Electromagnetic spectrum"
    ],
    "Optics": [
      "Reflection of light",
      "Refraction of light",
      "Total internal reflection",
      "Lenses and Mirrors",
      "Wave optics",
      "Interference",
      "Diffraction",
      "Polarization"
    ],
    "Dual Nature of Matter and Radiation": [
      "Photoelectric effect",
      "Einstein's photoelectric equation",
      "Matter waves",
      "De Broglie relation"
    ],
    "Atoms and Nuclei": [
      "Alpha-particle scattering",
      "Rutherford's model",
      "Bohr model",
      "Hydrogen spectrum",
      "Radioactivity",
      "Nuclear fission and fusion"
    ],
    "Electronic Devices": [
      "Semiconductors",
      "I-V characteristics",
      "Zener diode",
      "Logic gates"
    ],
    "Experimental Skills": [
      "Vernier calipers",
      "Screw gauge",
      "Simple Pendulum",
      "Metre Scale",
      "Young's modulus",
      "Surface tension",
      "Coefficient of Viscosity",
      "Speed of sound",
      "Specific heat capacity",
      "Resistivity",
      "Focal length"
    ]
  },
  "Chemistry": {
    "Some Basic Concepts in Chemistry": [
      "Dalton's atomic theory",
      "Atomic and molecular masses",
      "Mole concept",
      "Chemical equations",
      "Stoichiometry"
    ],
    "Atomic Structure": [
      "Bohr model",
      "Quantum mechanics",
      "Quantum numbers",
      "Aufbau principle",
      "Pauli's exclusion principle",
      "Hund's rule"
    ],
    "Chemical Bonding and Molecular Structure": [
      "Ionic Bonding",
      "Covalent Bonding",
      "VSEPR theory",
      "Valence bond theory",
      "Hybridization",
      "Molecular Orbital Theory",
      "Hydrogen bonding"
    ],
    "Chemical Thermodynamics": [
      "First law of thermodynamics",
      "Enthalpy",
      "Hess's law",
      "Second law of thermodynamics",
      "Gibbs energy"
    ],
    "Solutions": [
      "Concentration of solution",
      "Raoult's Law",
      "Colligative properties",
      "Van't Hoff factor"
    ],
    "Equilibrium": [
      "Law of chemical equilibrium",
      "Le Chatelier's principle",
      "Ionic equilibrium",
      "pH scale",
      "Buffer solutions",
      "Solubility product"
    ],
    "Redox Reactions and Electrochemistry": [
      "Oxidation and reduction",
      "Electrolytic and metallic conduction",
      "Kohlrausch's law",
      "Electrochemical cells",
      "Nernst equation",
      "Fuel cells"
    ],
    "Chemical Kinetics": [
      "Rate of reaction",
      "Order and molecularity",
      "Rate law",
      "Arrhenius theory",
      "Activation energy"
    ],
    "Classification of Elements and Periodicity": [
      "Modern periodic law",
      "Periodic trends",
      "Ionization enthalpy",
      "Electron gain enthalpy"
    ],
    "p-Block Elements": [
      "Group 13 to 18 Elements",
      "Electronic configuration",
      "Trends in properties"
    ],
    "d- and f-Block Elements": [
      "Transition Elements",
      "Lanthanoids",
      "Actinoids",
      "K2Cr2O7 and KMnO4"
    ],
    "Co-ordination Compounds": [
      "Werner's theory",
      "IUPAC nomenclature",
      "Valence bond theory",
      "Crystal field theory"
    ],
    "Purification and Characterisation": [
      "Crystallization",
      "Distillation",
      "Chromatography",
      "Qualitative analysis",
      "Quantitative analysis"
    ],
    "Some Basic Principles of Organic Chemistry": [
      "IUPAC Nomenclature",
      "Electronic displacement",
      "Inductive effect",
      "Resonance",
      "Hyperconjugation",
      "Reaction intermediates"
    ],
    "Hydrocarbons": [
      "Alkanes",
      "Alkenes",
      "Alkynes",
      "Aromatic hydrocarbons"
    ],
    "Organic Compounds Containing Halogens": [
      "Haloalkanes and Haloarenes",
      "SN1 and SN2 mechanisms",
      "Environmental effects"
    ],
    "Organic Compounds Containing Oxygen": [
      "Alcohols, Phenols, and Ethers",
      "Aldehydes and Ketones",
      "Carboxylic Acids"
    ],
    "Organic Compounds Containing Nitrogen": [
      "Amines",
      "Diazonium Salts"
    ],
    "Biomolecules": [
      "Carbohydrates",
      "Proteins",
      "Vitamins",
      "Nucleic Acids",
      "Hormones"
    ],
    "Principles Related to Practical Chemistry": [
      "Detection of elements",
      "Preparation of inorganic compounds",
      "Titrimetric exercises",
      "Salt analysis"
    ]
  },
  "Biology": {
    "Diversity in Living World": [
      "Taxonomy & Systematics",
      "Five kingdom classification",
      "Plant Kingdom",
      "Animal Kingdom"
    ],
    "Structural Organisation in Animals and Plants": [
      "Morphology of flowering plants",
      "Anatomy of flowering plants",
      "Animal tissues",
      "Morphology of Frog"
    ],
    "Cell Structure and Function": [
      "Prokaryotic and eukaryotic cells",
      "Cell organelles",
      "Biomolecules",
      "Enzymes",
      "Cell cycle and division"
    ],
    "Plant Physiology": [
      "Photosynthesis",
      "Respiration in plants",
      "Plant growth and development"
    ],
    "Human Physiology": [
      "Breathing and Respiration",
      "Body fluids and circulation",
      "Excretory products",
      "Locomotion and Movement",
      "Neural control and coordination",
      "Chemical coordination and regulation"
    ],
    "Reproduction": [
      "Sexual reproduction in flowering plants",
      "Human Reproduction",
      "Reproductive health"
    ],
    "Genetics and Evolution": [
      "Mendelian Inheritance",
      "Chromosomal theory of inheritance",
      "Molecular basis of Inheritance",
      "Evolution"
    ],
    "Biology and Human Welfare": [
      "Human Health and Disease",
      "Microbes in human welfare"
    ],
    "Biotechnology and Its Applications": [
      "Principles and process of Biotechnology",
      "Application of Biotechnology"
    ],
    "Ecology and Environment": [
      "Organisms and Populations",
      "Ecosystem",
      "Biodiversity and conservation"
    ]
  }
};
