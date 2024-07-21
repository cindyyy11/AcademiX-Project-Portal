import Link from "next/link";
import Image from "@/components/Image";
import Icon from "@/components/Icon";
import Users from "@/components/Users";
import styles from "./listStyle.module.css"
import { useRouter } from "next/router";

type RowProps = {
  item: any;
};



const Row = ({ item }: RowProps) => {
  console.log("item: ",item);

  const router = useRouter();
  const { pathname } = router;

  // Extract the role from the URL
  const getUserRoleFromPath = () => {
    const pathSegments = pathname.split('/');
    const roleIndex = pathSegments.indexOf('projects') + 1;
    return pathSegments[roleIndex];
  };

  const userRole = getUserRoleFromPath();

  const getTimelineLink = (id: string) => {
    switch (userRole) {
      case 'Student':
        return `/projects/Student/timeline-1view-case-study?id=${id}`;
      case 'Supervisor':
        return `/projects/Supervisor/timeline-setting?id=${id}`;
      case 'Admin':
        return `/projects/Admin/timeline-list?id=${id}`;
      default:
        return '#';
    }
  };

  console.log("userRole: ", userRole);

  return (
    <div className="flex items-center p-4 border-b border-n-1 last:border-none dark:border-white">
      <Link
        className="flex items-center grow text-sm font-bold transition-colors hover:text-purple-1"
        //href="/projects/projects-details"
        href="/projects/Student/timeline-1view-case-study"
      >
        <div className="relative w-8 h-8 p-2 mr-3 bg-background rounded-full">
          <Image
            className="w-full"
            src="/assets/project.png"
            width={16}
            height={16}
            alt="Logo"
          />
        </div>
        {item.title}
        <div
          className={`ml-2.5 md:hidden ${
            item.category === "UI Design"
              ? "label-stroke-yellow"
              : item.category === "Marketing"
              ? "label-stroke-green"
              : item.category === "Advertising"
              ? "label-stroke-pink"
              : "label-stroke-purple"
          }`}
        >
          {item.categories}
        </div>
      </Link>
      
      <div className="shrink-0 flex items-center min-w-[5rem] mr-5 text-xs font-bold md:min-w-min md:mr-0 md:ml-2">
        <Icon className="mr-1 dark:fill-white" name="tasks" />
        <span className="md:hidden">Tasks</span> {item.taskDone}/
        {item.tasksAll}
      </div>
      <div className="label-stroke shrink-0 min-w-[9rem] mr-4.5 lg:hidden">
        <Icon className="mr-1 dark:fill-white" name="calendar" />
        {item.dueDate}
      </div>
      <Users
        className="shrink-0 mr-3 lg:hidden"
        items={item.users}
        large
        border
      />
      <div className="flex flex-col gap-2 ml-4">
        {/* <Link href="/projects/Student/timeline-1view-case-study"> */}
        <Link href={getTimelineLink(item._id)}>
          <button className={styles.buttonLink}>Timeline</button>
        </Link>
        <Link href="/projects/kanban-desc">
          <button className={styles.buttonLink}>Kanban Desk</button>
        </Link>
      </div>
    </div>
  );
};

export default Row;