"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation"; // Import useRouter and useSearchParams from next/navigation
import { supabase } from "../../src/utils/supabase/superbase.js";
import styles from "./editform.module.css";

const allowedTeams = ["Men", "Women", "Under 14s", "Under 18s", "Open to All"];

export default function EditForm() {
  const router = useRouter(); // Initialize useRouter
  const searchParams = useSearchParams(); // Initialize useSearchParams
  const [eventUUID, setEventUUID] = useState(null);
  const [event, setEvent] = useState(null);
  const [form, setForm] = useState({
    event_type: "",
    date: "",
    time: "",
    team: "",
    location: "",
  });

  const [touched, setTouched] = useState({
    event_type: false,
    date: false,
    time: false,
    team: false,
    location: false,
  });

  const [valid, setValid] = useState({
    event_type: true,
    date: true,
    time: true,
    team: true,
    location: true,
  });

  useEffect(() => {
    const uuid = searchParams.get("eventUUID");
    if (uuid) {
      setEventUUID(uuid);
    }
  }, [searchParams]);

  useEffect(() => {
    if (eventUUID) {
      const getGame = async () => {
        const { data: game, error } = await supabase
          .from("games")
          .select("*")
          .eq("id", eventUUID)
          .single();

        if (error) {
          console.error("Error fetching game: ", error);
        } else if (game) {
          setEvent({
            id: game.id,
            event_type: game.event_type,
            date: game.date,
            time: game.time,
            team: game.team,
            location: game.location,
          });
          setForm({
            event_type: game.event_type,
            date: game.date,
            time: game.time,
            team: game.team,
            location: game.location,
          });
        }
      };
      getGame();
    }
  }, [eventUUID]);

  const deleteGame = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from("games").delete().eq("id", eventUUID);

    if (error) {
      console.error("Error deleting game: ", error);
    } else {
      setEvent(null);
      router.push("/editconfirmation?message=deleted");
    }
  };

  const updateGame = async (e) => {
    e.preventDefault();

    const newValid = {
      event_type: !!form.event_type,
      date: !!form.date,
      time: !!form.time,
      team: !!form.team,
      location: !!form.location,
    };

    setValid(newValid);

    if (Object.values(newValid).every(Boolean)) {
      const { error } = await supabase
        .from("games")
        .update(form)
        .eq("id", eventUUID);

      if (error) {
        console.error("Error updating game: ", error);
      } else {
        setEvent(form);
        router.push("/editconfirmation?message=updated");
      }
    }
  };

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setTouched({ ...touched, [e.target.name]: true });
  };

  return (
    <div className={styles.container}>
      {event && (
        <form className={styles.contactForm} onSubmit={updateGame}>
          <h3 className={styles.subtitle}>Edit Event</h3>
          <div className={styles.formSection}>
            <label className={styles.label} htmlFor="event_type">
              Event Type:
            </label>
            <input
              type="text"
              id="event_type"
              name="event_type"
              value={form.event_type}
              onChange={handleInputChange}
            />
            {!valid.event_type && touched.event_type && (
              <div style={{ color: "red" }}>Event Type is required</div>
            )}
          </div>
          <div className={styles.formSection}>
            <label className={styles.label} htmlFor="date">
              Date:
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={form.date}
              onChange={handleInputChange}
            />
            {!valid.date && touched.date && (
              <div style={{ color: "red" }}>Date is required</div>
            )}
          </div>
          <div className={styles.formSection}>
            <label className={styles.label} htmlFor="time">
              Time:
            </label>
            <input
              type="time"
              id="time"
              name="time"
              value={form.time}
              onChange={handleInputChange}
            />
            {!valid.time && touched.time && (
              <div style={{ color: "red" }}>Time is required</div>
            )}
          </div>
          <div className={styles.formSection}>
            <label className={styles.label} htmlFor="location">
              Location:
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={form.location}
              onChange={handleInputChange}
            />
            {!valid.location && touched.location && (
              <div style={{ color: "red" }}>Location is required</div>
            )}
          </div>
          <div className={styles.formSection}>
            <label className={styles.label} htmlFor="team">
              Team:
            </label>
            <select
              id="team"
              name="team"
              value={form.team}
              onChange={handleInputChange}
            >
              {allowedTeams.map((team) => (
                <option key={team} value={team}>
                  {team}
                </option>
              ))}
            </select>
            {!valid.team && touched.team && (
              <div style={{ color: "red" }}>Team is required</div>
            )}
          </div>

          <button className={styles.requestButton} type="submit">
            UPDATE EVENT
          </button>
          <button className={styles.requestButton} onClick={deleteGame}>
            DELETE EVENT
          </button>
        </form>
      )}
    </div>
  );
}
