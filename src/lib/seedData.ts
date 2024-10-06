import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

async function seedDatabase() {
  // Seed organizations
  const organization = await prisma.organizations.create({
    data: {
      name: faker.company.name(),
    },
  });

  // Seed users
  const user = await prisma.users.create({
    data: {
      idp_id: faker.string.uuid(),
    },
  });

  // Seed companies
  const company = await prisma.companies.create({
    data: {
      name: faker.company.name(),
      industry: faker.company.buzzPhrase(),
      size: faker.helpers.arrayElement(["Small", "Medium", "Large"]),
    },
  });

  // Seed contacts
  const contact = await prisma.contacts.create({
    data: {
      company_id: company.id,
      name: faker.person.fullName(),
      email: faker.internet.email(),
      phone: faker.phone.number(),
      position: faker.person.jobTitle(),
    },
  });

  // Seed meetings
  const meeting = await prisma.meetings.create({
    data: {
      user_id: user.id,
      company_id: company.id,
      contact_id: contact.id,
      scheduled_at: faker.date.future(),
      transcription: faker.lorem.paragraph(),
      extracted_data: faker.lorem.sentence(),
      prior_context: faker.lorem.sentence(),
    },
  });

  // Seed action plans
  const actionPlan = await prisma.action_plans.create({
    data: {
      meeting_id: meeting.id,
      description: faker.lorem.sentence(),
      due_date: faker.date.future(),
      status: faker.helpers.arrayElement([
        "Pending",
        "In Progress",
        "Completed",
      ]),
    },
  });

  // Seed tasks
  await prisma.tasks.create({
    data: {
      action_plan_id: actionPlan.id,
      description: faker.lorem.sentence(),
      assigned_to: user.id,
      due_date: faker.date.future(),
      status: faker.helpers.arrayElement([
        "Pending",
        "In Progress",
        "Completed",
      ]),
    },
  });

  // Seed discovery templates
  const discoveryTemplate = await prisma.discovery_templates.create({
    data: {
      organization_id: organization.id,
      user_id: user.id,
      name: faker.lorem.words(3),
      description: faker.lorem.sentence(),
    },
  });

  // Seed discovery questions
  await prisma.discovery_questions.create({
    data: {
      template_id: discoveryTemplate.id,
      question: faker.lorem.sentence(),
      category: faker.lorem.word(),
      question_priority: faker.number.int({ min: 1, max: 5 }),
    },
  });

  // Seed events
  await prisma.events.create({
    data: {
      account_id: faker.string.uuid(),
      calendar_id: faker.string.uuid(),
      user_id: user.id,
      title: faker.lorem.words(3),
      description: faker.lorem.sentence(),
      location: faker.location.streetAddress(),
      when: JSON.stringify({
        start: faker.date.future(),
        end: faker.date.future(),
      }),
      participants: JSON.stringify([
        { name: faker.person.fullName(), email: faker.internet.email() },
        { name: faker.person.fullName(), email: faker.internet.email() },
      ]),
      organizer: JSON.stringify({
        name: faker.person.fullName(),
        email: faker.internet.email(),
      }),
      conferencing: JSON.stringify({
        type: "zoom",
        url: faker.internet.url(),
      }),
      metadata: JSON.stringify({
        custom_field: faker.lorem.word(),
      }),
    },
  });

  console.log("Database seeded successfully");
}

async function wipeDatabase() {
  await prisma.tasks.deleteMany();
  await prisma.action_plans.deleteMany();
  await prisma.presentations.deleteMany();
  await prisma.meetings.deleteMany();
  await prisma.user_contacts.deleteMany();
  await prisma.contact_relationships.deleteMany();
  await prisma.contacts.deleteMany();
  await prisma.companies.deleteMany();
  await prisma.discovery_questions.deleteMany();
  await prisma.discovery_templates.deleteMany();
  await prisma.organization_users.deleteMany();
  await prisma.organizations.deleteMany();
  await prisma.events.deleteMany();
  await prisma.users.deleteMany();

  console.log("Database wiped successfully");
}

async function main() {
  await wipeDatabase();
  await seedDatabase();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
