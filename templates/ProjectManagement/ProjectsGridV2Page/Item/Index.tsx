import Link from "next/link";
import Image from "@/components/Image";
import Icon from "@/components/Icon";
import Users from "@/components/Users";
import styles from "./gridStyle.module.css";
import { useRouter } from "next/router";

type ItemProps = {
  item: any;
};

const Item = ({ item }: ItemProps) => {
  console.log("item: ", item);

  const router = useRouter();
  const { pathname } = router;

  // Extract the role from the URL
  const getUserRoleFromPath = () => {
    const pathSegments = pathname.split("/");
    const roleIndex = pathSegments.indexOf("projects") + 1;
    return pathSegments[roleIndex];
  };

  const userRole = getUserRoleFromPath();

  const getTimelineLink = (id: string) => {
    switch (userRole) {
      case "Student":
        return `/projects/Student/timeline-1view-case-study?id=${id}`;
      case "Supervisor":
        return `/projects/Supervisor/timeline-setting?id=${id}`;
      case "Admin":
        return `/projects/Admin/timeline-list?id=${id}`;
      default:
        return "#";
    }
  };



  return (
    <div className="relative w-[calc(33.333%-1.25rem)] mt-5 mx-2.5 pt-22 px-5 pb-8 card text-center lg:w-[calc(50%-1.25rem)] md:w-[calc(100%-1.25rem)] md:py-8 md:mt-2.5">
      <Users
        className="absolute top-5 left-5 md:hidden"
        items={item.users}
        border
      />
      <button className="absolute top-4 right-3 btn-transparent-dark btn-small btn-square md:hidden">
        <Icon name="dots" />
      </button>
      <div className="relative w-[4.25rem] h-[4.25rem] mx-auto mb-4 p-5 bg-background rounded-full">
        <Image
          className="w-full"
          src="/assets/project.png"
          width={30}
          height={30}
          alt="Logo"
        />
      </div>
      <Link
        className="block mb-3 text-h6 md:mb-6 transition-colors hover:text-purple-1"
        href="/projects/Student/timeline-1view-case-study"
      >
        {item.title}
      </Link>

      <div className="flex flex-col gap-2 justify-center my-6">
        <Link href={getTimelineLink(item._id)}>
          <button className={styles.buttonLink}>Timeline</button>
        </Link>
        <Link href={`/projects/kanban-desc?id=${item._id}`}>
          <button className={styles.buttonLink}>Kanban Desk</button>
        </Link>
      </div>

      <div className="label-stroke min-w-[8.75rem] mb-4.5">
        <Icon className="mr-1 dark:fill-white" name="calendar" />
        {item.dueDate}
      </div>
      <div className="flex justify-center items-center text-xs font-bold">
        <Icon className="dark:fill-white" name="tasks" />
        <span className="mx-1">Tasks</span>
        {item.tasksDone}/{item.tasksAll}
      </div>
    </div>
  );
};

export default Item;
