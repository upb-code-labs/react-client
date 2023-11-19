import { faker } from "@faker-js/faker";

export function getRandomEmail(domain: string = "upb.edu.co"): string {
  return faker.internet.email({ provider: domain });
}

export function getRandomUniversityID(): string {
  return faker.number.int({ min: 100000, max: 999999 }).toString();
}

export function getRandomName(): string {
  return faker.person.fullName();
}

export function getDefaultPassword(): string {
  return "upbbga2020*/";
}

export function getDevelopmentAdminCredentials(): { email: string; password: string } {
  return {
    email: "development.admin@gmail.com", 
    password: "changeme123*/"
  };
}