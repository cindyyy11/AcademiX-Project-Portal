import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Modal from "@/components/Modal";
import Field from "@/components/Field";
import Select from "@/components/Select";
import Icon from "@/components/Icon";

type Supervisor = {
  _id: string;
  name: string;
  email: string;
  role: string;
  imageUrl: string;
  lastSeen: string;
  lastSeenDateTime: string;
};

type ProjectForm = {
  title: string;
  categories: string;
  about: string;
  objective: string;
  supervisorId: string;
  handOutDate: string;
  dueDate: string;
};

type Props = {
  onClose: () => void;
};

const dateInputClass = "dark:[color-scheme:dark]";

const CreateProjectModal: React.FC<Props> = ({ onClose }) => {
  const [form, setForm] = useState<ProjectForm>({
    title: "",
    categories: "",
    about: "",
    objective: "",
    supervisorId: "",
    handOutDate: "",
    dueDate: "",
  });
  const [supervisors, setSupervisors] = useState<Supervisor[]>([]);
  const [error, setError] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);

  useEffect(() => {
    const fetchSupervisors = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/v1/get-supervisors"
        );
        setSupervisors(response.data.supervisors);
      } catch (err) {
        console.error("Failed to fetch supervisors", err);
        setError("Could not load supervisors. Please try again later.");
      }
    };

    fetchSupervisors();
  }, []);

  const supervisorItems = useMemo(
    () => supervisors.map((s) => ({ id: s._id, title: s.name })),
    [supervisors]
  );
  const selectedSupervisor =
    supervisorItems.find((item) => item.id === form.supervisorId) || null;

  const update =
    (name: keyof ProjectForm) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.supervisorId) {
      setError("Please select a supervisor.");
      return;
    }
    if (form.handOutDate && form.dueDate && form.dueDate < form.handOutDate) {
      setError("The due date can't be before the handout date.");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch(
        `http://localhost:8000/api/v1/create-project-details`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...form,
            handOutDate: form.handOutDate || null,
            dueDate: form.dueDate || null,
            supervisor: null,
            members: [],
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create project details");
      }

      onClose();
    } catch (err) {
      console.error("Failed to create project details:", err);
      setError("Failed to create the project. Please try again.");
      setSubmitting(false);
    }
  };

  return (
    <Modal
      classWrap="max-w-[46rem] dark:text-white"
      classButtonClose="top-5"
      visible
      onClose={onClose}
    >
      <div className="px-5 py-4 pr-14 border-b border-n-1 dark:border-white">
        <div className="text-h6">Create new project</div>
        <p className="mt-0.5 text-xs font-bold text-n-3 dark:text-white/50">
          This information will be displayed to project members. Fields marked
          * are required.
        </p>
      </div>
      <form className="p-5" onSubmit={handleSubmit}>
        <div className="grid grid-cols-6 gap-x-4 gap-y-4 md:grid-cols-1">
          <Field
            className="col-span-3 md:col-span-1"
            classInput="h-12"
            label="Project title *"
            placeholder="Enter project title"
            value={form.title}
            onChange={update("title")}
            required
          />
          <Field
            className="col-span-3 md:col-span-1"
            classInput="h-12"
            label="Categories *"
            placeholder="e.g. Web Development"
            value={form.categories}
            onChange={update("categories")}
            required
          />
          <Field
            className="col-span-3 md:col-span-1"
            label="About"
            placeholder="Write a few sentences about the project"
            textarea
            value={form.about}
            onChange={update("about")}
          />
          <Field
            className="col-span-3 md:col-span-1"
            label="Objective"
            placeholder="Write the main objectives of the project"
            textarea
            value={form.objective}
            onChange={update("objective")}
          />
          <Select
            className="col-span-2 md:col-span-1"
            classButton="h-12"
            classOptions="max-h-44 overflow-y-auto"
            label="Supervisor *"
            placeholder="Select a supervisor"
            items={supervisorItems}
            value={selectedSupervisor}
            onChange={(item: { id: string }) =>
              setForm((prev) => ({ ...prev, supervisorId: item.id }))
            }
          />
          <Field
            className="col-span-2 md:col-span-1"
            classInput={`h-12 px-4 ${dateInputClass}`}
            label="Handout date"
            type="date"
            value={form.handOutDate}
            onChange={update("handOutDate")}
          />
          <Field
            className="col-span-2 md:col-span-1"
            classInput={`h-12 px-4 ${dateInputClass}`}
            label="Due date"
            type="date"
            value={form.dueDate}
            onChange={update("dueDate")}
          />
        </div>
        <div className="flex items-center gap-3 mt-5 pt-5 border-t border-n-1 dark:border-white md:flex-col md:items-stretch">
          {error && (
            <div className="flex items-center mr-auto px-3 py-2 border border-pink-1 rounded-sm bg-pink-2 text-xs font-bold text-n-1 md:mr-0">
              <Icon
                className="shrink-0 icon-16 mr-2 fill-n-1"
                name="info-circle"
              />
              {error}
            </div>
          )}
          <div className="flex gap-3 ml-auto md:ml-0 md:flex-col-reverse">
            <button type="button" className="btn-stroke" onClick={onClose}>
              Cancel
            </button>
            <button
              type="submit"
              className="btn-purple btn-shadow disabled:opacity-50 disabled:pointer-events-none"
              disabled={submitting}
            >
              {submitting ? "Creating..." : "Create project"}
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default CreateProjectModal;
