"use client";

import React from "react";
import { LivelyGuardianBot } from "./LivelyGuardianBot";
import { Exam, StudentProfile } from "@/lib/examStore";

export interface ReviveXBotWidgetProps {
  currentExam?: Exam;
  currentStudent?: StudentProfile;
  isExamMode?: boolean;
}

export const ReviveXBotWidget: React.FC<ReviveXBotWidgetProps> = (props) => {
  return <LivelyGuardianBot {...props} />;
};

export default ReviveXBotWidget;
