import myImage from "@/assets/me.png";
import { Profile } from "@/types/Experience";

const profile: Profile = {
  name: "Pulkit",
  caption: "Full Stack Developer & Open Source Enthusiast",
  image: myImage,
  contactLink: {
    github: "https://github.com/Pulkitxm",
    linkedin: "https://www.linkedin.com/in/pulkit-dce/",
    twitter: "https://x.com/devpulkitt",
  },
  experience: [
    {
      companyName: "DatawaveLabs",
      position: "Full Stack Engineer",
      startDate: new Date("2024-04-01"),
      endDate: new Date("2024-09-30"),
      location: "India",
      type: "remote",
      url: "https://datawavelabs.io/",
    },
    {
      companyName: "GeeksforGeeks",
      position: "Campus Mantri",
      // Apr 2024
      startDate: new Date("2024-04-01"),
      location: "India",
      type: "hybrid",
      url: "https://geeksforgeeks.org/",
    },
  ],
};

profile.experience.sort((a, b) => {
  if (!a.endDate && b.endDate) return -1;
  if (!b.endDate && a.endDate) return 1;
  if (!a.endDate && !b.endDate)
    return a.startDate.getTime() - b.startDate.getTime();
  return (b.endDate?.getTime() || 0) - (a.endDate?.getTime() || 0);
});

export default profile;
