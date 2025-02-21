import Link from "next/link";
import { CheckIcon, Linkedin } from "lucide-react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/components/avatar";
import { Card } from "@workspace/ui/components/card";

export default function Page() {
  return (
    <div className="mt-20 flex flex-col items-center flex-1">
      <section className="py-12">
        <div className="container px-4 md:px-6">
          <div className="grid gap-10 sm:px-10 md:grid-cols-2 md:gap-16">
            <div>
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                  Our Mission
                </h2>
                <p className="text-muted-foreground max-w-[600px] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Simplify healthcare operations with efficient, innovative
                  software and services.
                </p>
              </div>
              <div className="space-y-2 pt-6">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                  Our Vision
                </h2>
                <p className="text-muted-foreground max-w-[600px] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Provide modern, purpose-built tools for healthcare operations
                  and contribute to the Value-Based Care revolution by returning
                  value to our customers.
                </p>
              </div>
              <div className="space-y-2 pt-6">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                  Our Values
                </h2>
                <ul className="text-muted-foreground grid gap-2">
                  <li>
                    <CheckIcon className="mr-2 inline-block size-4" />
                    Customer Centricity
                  </li>
                  <li>
                    <CheckIcon className="mr-2 inline-block size-4" />
                    Innovation
                  </li>
                  <li>
                    <CheckIcon className="mr-2 inline-block size-4" />
                    Efficiency
                  </li>
                  <li>
                    <CheckIcon className="mr-2 inline-block size-4" />
                    Adaptability
                  </li>
                </ul>
              </div>
            </div>
            <div className="flex flex-col items-start space-y-4">
              <div className="bg-muted inline-block rounded-lg px-3 py-1 text-sm">
                Leadership Team
              </div>
              <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2">
                <Card className="flex w-[80dvw] max-w-[600px] flex-col gap-4 p-6 md:w-[40dvw]">
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarImage src="/todd-linkedin-pic.jpeg" />
                      <AvatarFallback>TD</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-lg font-medium">Todd Dugan</p>
                      <p className="text-muted-foreground text-sm">Founder</p>
                    </div>
                    <Link
                      className="underline-offset-4 hover:underline"
                      href={"https://www.linkedin.com/in/tdugan4"}
                      referrerPolicy="no-referrer"
                      target="_blank"
                    >
                      <Linkedin className="size-6" />
                    </Link>
                  </div>
                  <p className="text-muted-foreground">
                    As the Founder of VB Tech, I bring over 15 years of
                    specialized experience at the crossroads of healthcare
                    administration and technology. With experience leading
                    technology build-outs and capabilities at leading
                    value-based care (VBC) organizations—particularly in
                    Medicare Advantage (MA) and ACO REACH—I’ve cultivated a
                    unique blend of skills that enable me to tackle the most
                    complex challenges in healthcare operations. My career has
                    been defined by a commitment to innovation and excellence,
                    driving results that have consistently transformed the
                    organizations I’ve worked with.
                  </p>
                  <p className="text-muted-foreground">
                    In my roles leading payment operations for two physician
                    enablement organizations across several ACOs and MA payers,
                    I witnessed firsthand the significant gaps in existing
                    technology. These challenges required dedicating hundreds of
                    man-hours to manual processes—inefficiencies that too often
                    led to errors and costly reconciliation efforts. This deep
                    understanding of operational pain points has fueled my
                    determination to create a better solution.
                  </p>
                  <p className="text-muted-foreground">
                    At VB Tech, I’m channeling this expertise to first develop
                    VB Pay, a tool specifically designed to simplify and
                    automate payment processes in value-based care. VB Pay is
                    centered on delivering measurable ROI for our customers by
                    providing technology that not only enhances operational
                    efficiency but also directly improves patient care and
                    physician satisfaction. VB Tech is more than a company—it’s
                    the culmination of my experience and vision to modernize
                    healthcare payment systems and make a tangible impact in the
                    industry.
                  </p>
                </Card>
                {/*<Card className="flex flex-col gap-4 p-6">
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarImage src="/placeholder-user.jpg" />
                      <AvatarFallback>JA</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-lg font-medium">Jane Ahn</p>
                      <p className="text-muted-foreground text-sm">
                        CTO &amp; Co-Founder
                      </p>
                    </div>
                  </div>
                  <p className="text-muted-foreground">
                    Jane is a highly skilled software engineer with a passion
                    for building cutting-edge technologies. She co-founded Acme
                    Tech to revolutionize the way businesses approach
                    technology.
                  </p>
                </Card>
                <Card className="flex flex-col gap-4 p-6">
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarImage src="/placeholder-user.jpg" />
                      <AvatarFallback>SM</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-lg font-medium">Sarah Miller</p>
                      <p className="text-muted-foreground text-sm">
                        VP of Product
                      </p>
                    </div>
                  </div>
                  <p className="text-muted-foreground">
                    Sarah is a product visionary with a deep understanding of
                    user needs. She leads the product team at Acme Tech,
                    ensuring our solutions are tailored to the evolving demands
                    of our clients.
                  </p>
                </Card>
                <Card className="flex flex-col gap-4 p-6">
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarImage src="/placeholder-user.jpg" />
                      <AvatarFallback>MR</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-lg font-medium">Michael Roth</p>
                      <p className="text-muted-foreground text-sm">
                        VP of Engineering
                      </p>
                    </div>
                  </div>
                  <p className="text-muted-foreground">
                    Michael is a seasoned engineering leader with a track record
                    of building high-performing teams and delivering complex
                    software projects. He oversees the engineering efforts at
                    Acme Tech.
                  </p>
                </Card>*/}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
