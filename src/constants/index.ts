/* Word/image pairs for animated or repeated DOM sections that can cycle through creative labels. */
type Word = {
  text: string;
  imgPath: string;
};

const imagePath = (fileName: string) => `${import.meta.env.BASE_URL}images/${fileName}`;

const words: Word[] = [
  { text: "Ideas", imgPath: imagePath("ideas.svg") },
  { text: "Concepts", imgPath: imagePath("concepts.svg") },
  { text: "Designs", imgPath: imagePath("designs.svg") },
  { text: "Code", imgPath: imagePath("code.svg") },
  { text: "Ideas", imgPath: imagePath("ideas.svg") },
  { text: "Concepts", imgPath: imagePath("concepts.svg") },
  { text: "Designs", imgPath: imagePath("designs.svg") },
  { text: "Code", imgPath: imagePath("code.svg") },
];


/* Ability cards pair an image path with display copy so UI sections can render consistent cards. */
type Ability = {
  imgPath: string;
  title: string;
  desc: string;
};

const abilities: Ability[] = [
  {
    imgPath: imagePath("seo.png"),
    title: "Quality Focus",
    desc: "Delivering high-quality results while maintaining attention to every detail.",
  },
  {
    imgPath: imagePath("chat.png"),
    title: "Reliable Communication",
    desc: "Keeping you updated at every step to ensure transparency and clarity.",
  },
  {
    imgPath: imagePath("time.png"),
    title: "On-Time Delivery",
    desc: "Making sure projects are completed on schedule, with quality & attention to detail.",
  },
];




/* Named exports let pages/components import only the DOM data collections they need. */
export {
  words,
  abilities
};
