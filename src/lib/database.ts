import { supabase } from "./supabase";
import { Database } from "@/types/database.types";

export type Birthday = Database["public"]["Tables"]["birthdays"]["Row"];
export type User = Database["public"]["Tables"]["users"]["Row"];

// Birthday CRUD operations
export const getBirthdays = async (userId: string) => {
  const { data, error } = await supabase
    .from("birthdays")
    .select("*")
    .eq("user_id", userId)
    .order("date");

  if (error) {
    console.error("Error fetching birthdays:", error);
    throw error;
  }

  return data;
};

export const getBirthday = async (id: string) => {
  const { data, error } = await supabase
    .from("birthdays")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching birthday:", error);
    throw error;
  }

  return data;
};

export const createBirthday = async (
  birthday: Omit<Birthday, "id" | "created_at" | "updated_at">,
) => {
  const { data, error } = await supabase
    .from("birthdays")
    .insert(birthday)
    .select()
    .single();

  if (error) {
    console.error("Error creating birthday:", error);
    throw error;
  }

  return data;
};

export const updateBirthday = async (
  id: string,
  birthday: Partial<Omit<Birthday, "id" | "created_at" | "updated_at">>,
) => {
  const { data, error } = await supabase
    .from("birthdays")
    .update(birthday)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating birthday:", error);
    throw error;
  }

  return data;
};

export const deleteBirthday = async (id: string) => {
  const { error } = await supabase.from("birthdays").delete().eq("id", id);

  if (error) {
    console.error("Error deleting birthday:", error);
    throw error;
  }

  return true;
};

// User operations
export const getUser = async (id: string) => {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching user:", error);
    throw error;
  }

  return data;
};

export const updateUser = async (
  id: string,
  user: Partial<Omit<User, "id" | "created_at" | "updated_at">>,
) => {
  const { data, error } = await supabase
    .from("users")
    .update(user)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating user:", error);
    throw error;
  }

  return data;
};
