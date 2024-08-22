import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import '../styles/Student_Timeline.css';

const Sidebar: React.FC = () => {
  return (
    <div className="timeline-left">
      <nav className='timeline-leftNav'>
        This is the Sidebar<br/><br/>
        <CustomLink href="/student/timeline/view-case-study">Student</CustomLink>
        <CustomLink href="/supervisor/timeline/setting">Supervisor</CustomLink>
        <CustomLink href="/admin/timeline/list">Admin</CustomLink>
      </nav>
    </div>
  );
};

interface CustomLinkProps {
  href: string;
  children: React.ReactNode;
}

const CustomLink: React.FC<CustomLinkProps> = ({ href, children, ...props }) => {
  const router = useRouter();
  const isActive = router.pathname === href;

  return (
    <li className={isActive ? "sidebar-active" : ""}>
      <Link href={href}>
        <a {...props}>
          <button>
            {children}
          </button>
        </a>
      </Link>
    </li>
  );
};

export default Sidebar;
