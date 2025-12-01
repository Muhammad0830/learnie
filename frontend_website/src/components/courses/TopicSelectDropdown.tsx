"use client";
import { Topic } from "@/types/types";
import { useTranslations } from "next-intl";
import { FieldErrors } from "react-hook-form";
import { SelectedTopicForCourseFormData } from "@/schemas/topicShema";
import {
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenu,
} from "../ui/dropdown-menu";
import CustomButton from "../ui/customButton";
import { cn } from "@/lib/utils";
import { useMemo, useState } from "react";
import { Input } from "../ui/input";
import { AnimatePresence, motion } from "framer-motion";

const TopicSelectDropdown = ({
  topics,
  errors,
  selectedTopicId,
  handleSelectTopic,
  className,
  isLoading,
  selectedCourseId,
}: {
  topics: Topic[] | undefined;
  errors: FieldErrors<SelectedTopicForCourseFormData>;
  selectedTopicId: number;
  handleSelectTopic: (topicId: number) => void;
  className?: string;
  isLoading?: boolean;
  selectedCourseId: number | null | undefined;
}) => {
  const t = useTranslations("Courses");
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);

  const filteredTopics = useMemo(() => {
    if (!topics) return [];
    return topics.filter((topic: Topic) =>
      topic.title.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, topics]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
  };

  const selectedTopic = topics?.find(
    (topic) => Number(topic.id) === selectedTopicId
  )?.title;

  return (
    <div className="mb-5">
      <div className="flex items-center gap-2">
        <AnimatePresence>
          <motion.div layout className="w-full">
            {Boolean(selectedCourseId) &&
            topics?.length &&
            topics?.length > 0 ? (
              <motion.div
                layout
                key={`${selectedCourseId}_topics`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2, ease: "easeInOut", type: "tween" }}
                className="w-full"
              >
                <label className="font-semibold block mb-1">
                  {t("Select a Topic")}
                </label>

                <div className="flex gap-2 items-center">
                  <div>
                    <DropdownMenu
                      modal={false}
                      open={open}
                      onOpenChange={setOpen}
                    >
                      <DropdownMenuTrigger asChild>
                        <CustomButton
                          variants="primary"
                          type="button"
                          className={cn(
                            "relative z-10 bg-[#ffffff] dark:bg-[#000000] group",
                            className
                          )}
                        >
                          <span className="relative z-10">
                            {selectedTopic ? t("Change") : t("Select a Topic")}
                          </span>
                          <div className="absolute inset-0 bg-primary/30 group-hover:bg-primary/0 z-0" />
                        </CustomButton>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent
                        align="start"
                        side="bottom"
                        className="min-w-[300px] flex flex-col gap-1 p-1 rounded-sm border border-primary max-h-[300px] overflow-hidden"
                      >
                        {/* search */}
                        <div
                          className="pb-1"
                          onPointerDown={(e) => e.stopPropagation()}
                          onKeyDown={(e) => e.stopPropagation()}
                          tabIndex={-1}
                        >
                          <Input
                            autoFocus
                            value={search}
                            onChange={handleChange}
                            placeholder={t("Type to search")}
                            className="px-2 py-1 rounded border-2 border-primary focus-visible:ring-0 focus-visible:border-primary shadow-[0px_0px_5px_2px_#1d65ff50] dark:shadow-[0px_0px_5px_2px_#1d65ff50] mb-1 w-full"
                          />
                        </div>

                        {/* topics list */}
                        {isLoading ? (
                          <div className="px-2 pb-1">{t("Loading")}</div>
                        ) : (
                          <div className="flex-1 flex flex-col gap-1 overflow-auto w-full">
                            {filteredTopics?.map((topic: Topic) => (
                              <button
                                key={topic.id}
                                onClick={() => {
                                  handleSelectTopic(Number(topic.id));
                                  setOpen(false);
                                }}
                                className={cn(
                                  "flex items-center rounded border border-primary/50 bg-primary/5 justify-start group hover:bg-primary/10 gap-2 px-2 py-1.5 text-sm cursor-pointer",
                                  selectedTopicId === Number(topic.id) &&
                                    "bg-primary/20 hover:bg-primary/20"
                                )}
                              >
                                {topic.title}
                                <span
                                  className={cn(
                                    "text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-100",
                                    selectedTopicId === Number(topic.id) &&
                                      "opacity-100"
                                  )}
                                >
                                  ✓
                                </span>
                              </button>
                            ))}
                          </div>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div
                    className={cn(
                      "z-0 w-full truncate relative cursor-default opacity-0 -translate-x-10 transition-all duration-200",
                      Boolean(selectedTopic) && "opacity-100 translate-x-0"
                    )}
                  >
                    {t("Selected topic:")}{" "}
                    <span className="text-primary font-semibold">
                      {selectedTopic}
                    </span>
                  </div>
                </div>
              </motion.div>
            ) : (
              Boolean(selectedCourseId) && (
                <motion.div
                  layout
                  key={`${selectedCourseId}_no_topics`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{
                    duration: 0.2,
                    ease: "easeInOut",
                    type: "tween",
                  }}
                  className="flex items-center gap-2 mt-2"
                >
                  <div>
                    <p>{t("No topics found inside this course")}</p>
                    <p>{t("Do you want to create topics first?")}</p>
                  </div>
                  <CustomButton variants="outline" className="py-1.5 px-4">
                    {t("Create")}
                  </CustomButton>
                </motion.div>
              )
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {topics?.length && topics.length > 0 && errors.topicId && (
        <p className="text-red-500 text-xs mt-1">
          {t(`${errors.topicId.message}`)}
        </p>
      )}
    </div>
  );
};

export default TopicSelectDropdown;
