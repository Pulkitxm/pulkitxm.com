import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import Image from "next/image";
import assets from "@/data/assets";

export default function DatawavelabsExperience() {
  return (
    <div>
      <h1 className="mb-4 text-lg font-bold text-primary md:text-xl lg:text-2xl">
        <span className="underline">{datwaveLabsExp.position}</span>@
        <Link
          href={datwaveLabsExp.url}
          className="hover:text-primary-dark transition-colors duration-200 hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          {datwaveLabsExp.companyName}
        </Link>
      </h1>

      <section className="mb-12">
        <p className="mb-6 text-lg text-muted-foreground">
          My internship at Datawave Labs provided a hands-on experience as a
          Full Stack Engineer, immersing me in the development of a scalable,
          cloud-driven data intelligence platform. Below are detailed insights
          into the work I accomplished.
        </p>

        <div className="mb-8 overflow-hidden rounded-lg shadow-lg">
          <Image
            src={datwaveLabsExp.image}
            width={1200}
            height={800}
            alt="DatawaveLabs"
            className="w-full object-cover object-center"
          />
        </div>

        {datwaveLabsExp.work.map((section, index) => (
          <Card key={index} className="mb-6">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">
                {section.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-muted-foreground">
                {section.description}
              </p>
              <ul className="list-disc space-y-2 pl-6">
                {section.items.map((item, itemIndex) => (
                  <li key={itemIndex} className="text-muted-foreground">
                    {item}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="mb-12">
        <h3 className="mb-4 text-2xl font-bold text-primary sm:text-3xl">
          Technologies and Tools
        </h3>
        <p className="mb-4 text-muted-foreground">
          My work involved a diverse set of technologies and tools that are
          integral to modern full-stack development:
        </p>
        <div className="flex flex-wrap gap-2">
          {datwaveLabsExp.skills.map((tech, index) => (
            <Badge key={index} variant="secondary" className="text-sm">
              {tech}
            </Badge>
          ))}
        </div>
      </section>

      <section className="mb-12">
        <h3 className="mb-4 text-2xl font-bold text-primary sm:text-3xl">
          Conclusion
        </h3>
        <p className="text-muted-foreground">
          This internship was a comprehensive learning experience, blending
          practical development with exposure to modern technologies. It
          equipped me with a solid understanding of cloud integrations,
          real-time systems, and scalable application development, laying a
          strong foundation for future professional endeavors.
        </p>
      </section>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-xl">
            Relieving Letter
            <Link
              href={datwaveLabsExp.docLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink className="ml-2 h-5 w-5" />
            </Link>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <iframe
            src={datwaveLabsExp.docLink}
            title="Relieving Letter"
            className="h-60 w-full rounded-md border-0 lg:h-96"
          />
        </CardContent>
      </Card>
    </div>
  );
}

const datwaveLabsExp = {
  companyName: "DatawaveLabs",
  position: "Full Stack Engineer",
  startDate: new Date("2024-04-01"),
  endDate: new Date("2024-09-30"),
  location: "India",
  type: "remote",
  url: "https://datawavelabs.io/",
  slug: "datawavelabs",
  docLink: assets.datawaveRelievingLetter,
  work: [
    {
      title: "Authentication and Authorization Systems",
      description:
        "Designed and implemented a robust authentication system using JWT-based session management. Key tasks included:",
      items: [
        "Email/Password Authentication: Built a secure login and signup flow with password hashing and email verification to ensure account authenticity.",
        "Google OAuth Integration: Enabled Google Sign-In using OAuth 2.0, simplifying user onboarding with secure access tokens.",
        "Role-Based Access Control (RBAC): Developed middleware to restrict access to specific resources based on user roles.",
      ],
    },
    {
      title: "Cloud Integration",
      description:
        "Created seamless integrations for AWS, Azure, and GCP accounts, allowing users to manage cloud resources effortlessly. Key highlights:",
      items: [
        "Credential Handling: Implemented secure forms to collect and validate cloud credentials such as AWS Access Keys, Azure Tenant IDs, and GCP JSON files.",
        "Cloud Resource Management: Developed connectors for AWS S3, Azure Storage, and GCP Storage, enabling unified interaction with cloud services.",
      ],
    },
    {
      title: "Infrastructure Automation",
      description:
        "Automated cluster management workflows for infrastructure deployment. My contributions included:",
      items: [
        "API-Driven Cluster Creation: Developed APIs to deploy Docker containers, reducing manual intervention in infrastructure management.",
        "Real-Time Status Updates: Leveraged Event Source to provide users with live feedback on cluster creation and deletion processes.",
      ],
    },
    {
      title: "Notification System",
      description:
        "Built a real-time notification system using Redis Pub/Sub for efficient communication. Features included:",
      items: [
        "Real-Time Alerts: Delivered critical updates on system events, enhancing user experience and operational awareness.",
        "Notification Management: Created APIs to handle notifications, including read and delete functionalities.",
      ],
    },
    {
      title: "Client Development",
      description:
        "Worked extensively on the frontend using modern tools to enhance usability:",
      items: [
        "ReactJS and Tailwind CSS: Built responsive and accessible interfaces for authentication, cloud integration, and notifications.",
        "State Management with Recoil: Implemented efficient state handling to ensure a seamless user experience.",
      ],
    },
    {
      title: "Server Development",
      description: "Developed a scalable backend infrastructure using:",
      items: [
        "FastAPI: Built high-performance APIs for authentication, cloud integrations, and cluster management.",
        "Database Management: Migrated from psycopg2 to SQLAlchemy ORM for better schema management and maintainability.",
      ],
    },
    {
      title: "DevOps and Deployment",
      description:
        "Contributed to the project's scalability and reliability through DevOps practices:",
      items: [
        "Containerization with Docker: Ensured environment consistency for backend services.",
        "Kubernetes Integration: Orchestrated clusters for high availability and load balancing.",
        "CI/CD Pipelines: Implemented automated build and deployment pipelines to streamline releases.",
      ],
    },
  ],
  skills: [
    "ReactJS",
    "Tailwind CSS",
    "Recoil",
    "react-cookie",
    "FastAPI",
    "Redis Pub/Sub",
    "psycopg2",
    "SQLAlchemy ORM",
    "Docker",
    "Kubernetes",
    "Terraform",
    "AWS SDK (boto3)",
    "Azure SDK",
    "GCP SDK",
    "Postman",
    "Event Source Polyfill",
  ],
  image: assets.datawaveDashboard,
};
