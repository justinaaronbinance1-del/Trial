import React from "react";
import "../styles/icon-collection.css";

import { TbChecklist, TbTargetArrow } from "react-icons/tb";
import { FaScrewdriverWrench, FaRegLightbulb, FaCalendarDays, FaRegCircleUser } from "react-icons/fa6";
import { LuAlarmClockCheck } from "react-icons/lu";

const iconName = "react-icon";

const Icons = {
  UserIcon: () => <FaRegCircleUser className="user-icon" />,
  Checklist: () => <TbChecklist className={iconName} />,
  Wrench: () => <FaScrewdriverWrench className={iconName} />,
  Target: () => <TbTargetArrow className={iconName} />,
  Lightbulb: () => <FaRegLightbulb className={iconName} />,
  Calendar: () => <FaCalendarDays className={iconName} />,
  Clock: () => <LuAlarmClockCheck className={iconName} />
};

export default Icons;