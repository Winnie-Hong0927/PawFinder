import { relations } from "drizzle-orm/relations";
import { users, pets, adoptionApplications, adoptions, petVideos, videoReminders, donationCampaigns, donations, chatMessages } from "./schema";

export const petsRelations = relations(pets, ({one, many}) => ({
	user: one(users, {
		fields: [pets.createdBy],
		references: [users.id]
	}),
	adoptionApplications: many(adoptionApplications),
	adoptions: many(adoptions),
}));

export const usersRelations = relations(users, ({many}) => ({
	pets: many(pets),
	adoptionApplications_userId: many(adoptionApplications, {
		relationName: "adoptionApplications_userId_users_id"
	}),
	adoptionApplications_reviewedBy: many(adoptionApplications, {
		relationName: "adoptionApplications_reviewedBy_users_id"
	}),
	adoptions: many(adoptions),
	petVideos_userId: many(petVideos, {
		relationName: "petVideos_userId_users_id"
	}),
	petVideos_reviewedBy: many(petVideos, {
		relationName: "petVideos_reviewedBy_users_id"
	}),
	donationCampaigns: many(donationCampaigns),
	donations: many(donations),
	chatMessages: many(chatMessages),
}));

export const adoptionApplicationsRelations = relations(adoptionApplications, ({one, many}) => ({
	pet: one(pets, {
		fields: [adoptionApplications.petId],
		references: [pets.id]
	}),
	user_userId: one(users, {
		fields: [adoptionApplications.userId],
		references: [users.id],
		relationName: "adoptionApplications_userId_users_id"
	}),
	user_reviewedBy: one(users, {
		fields: [adoptionApplications.reviewedBy],
		references: [users.id],
		relationName: "adoptionApplications_reviewedBy_users_id"
	}),
	adoptions: many(adoptions),
}));

export const adoptionsRelations = relations(adoptions, ({one, many}) => ({
	pet: one(pets, {
		fields: [adoptions.petId],
		references: [pets.id]
	}),
	user: one(users, {
		fields: [adoptions.userId],
		references: [users.id]
	}),
	adoptionApplication: one(adoptionApplications, {
		fields: [adoptions.applicationId],
		references: [adoptionApplications.id]
	}),
	petVideos: many(petVideos),
	videoReminders: many(videoReminders),
}));

export const petVideosRelations = relations(petVideos, ({one}) => ({
	adoption: one(adoptions, {
		fields: [petVideos.adoptionId],
		references: [adoptions.id]
	}),
	user_userId: one(users, {
		fields: [petVideos.userId],
		references: [users.id],
		relationName: "petVideos_userId_users_id"
	}),
	user_reviewedBy: one(users, {
		fields: [petVideos.reviewedBy],
		references: [users.id],
		relationName: "petVideos_reviewedBy_users_id"
	}),
}));

export const videoRemindersRelations = relations(videoReminders, ({one}) => ({
	adoption: one(adoptions, {
		fields: [videoReminders.adoptionId],
		references: [adoptions.id]
	}),
}));

export const donationCampaignsRelations = relations(donationCampaigns, ({one, many}) => ({
	user: one(users, {
		fields: [donationCampaigns.createdBy],
		references: [users.id]
	}),
	donations: many(donations),
}));

export const donationsRelations = relations(donations, ({one}) => ({
	donationCampaign: one(donationCampaigns, {
		fields: [donations.campaignId],
		references: [donationCampaigns.id]
	}),
	user: one(users, {
		fields: [donations.userId],
		references: [users.id]
	}),
}));

export const chatMessagesRelations = relations(chatMessages, ({one}) => ({
	user: one(users, {
		fields: [chatMessages.userId],
		references: [users.id]
	}),
}));