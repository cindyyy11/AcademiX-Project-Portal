import { useState } from "react";
import { useMediaQuery } from "react-responsive";
import Layout from "@/components/Layout";
import Tabs from "@/components/Tabs";
import Icon from "@/components/Icon";
import Sorting from "@/components/Sorting/Index";
import Checkbox from "@/components/Checkbox";
import TablePagination from "@/components/TablePagination/Index";
import Row from "./Row";
import Item from "./Item";

import { useHydrated } from "@/hooks/useHydrated";

import {socialProfiles} from "@/mocks/profile";

const ContactsV1Page = () => {
    const [type, setType] = useState<string>("all-contacts");
    const [valueAll, setValueAll] = useState<boolean>(false);
    const { mounted } = useHydrated();

    const types = [
        {
            title: "All Contacts",
            value: "all-contacts",
        },
        {
            title: "Teammates",
            value: "teammates",
        },
        {
            title: "Lecturer",
            value: "lecturer",
        },
    ];

    const isMobile = useMediaQuery({
        query: "(max-width: 767px)",
    });

    return (
        <Layout title="All contacts">
            <div className="flex mb-6 md:mb-5 md:block">
                <Tabs
                    className="mr-auto md:ml-0"
                    classButton="md:ml-0 md:flex-1"
                    items={types}
                    value={type}
                    setValue={setType}
                />
                <button className="btn-stroke btn-small mr-1.5 md:hidden">
                    <Icon name="filters" />
                    <span>Sort: A-Z</span>
                </button>
                <button className="btn-stroke btn-small md:hidden">
                    <Icon name="dots" />
                    <span>Bulk Actions</span>
                </button>
            </div>
            {mounted && isMobile ? (
                <div className="card">
                    {socialProfiles.map((contact) => (
                        <Item item={contact} key={contact.id} />
                    ))}
                </div>
            ) : (
                <table className="table-custom table-select">
                    <thead>
                        <tr>
                            <th className="th-custom">
                                <Checkbox
                                    value={valueAll}
                                    onChange={() => setValueAll(!valueAll)}
                                />
                            </th>
                            <th className="th-custom">
                                <Sorting title="Name" />
                            </th>
                            <th className="th-custom">
                                <Sorting title="Email" />
                            </th>
                            <th className="th-custom lg:hidden">
                                <Sorting title="Service" />
                            </th>
                            <th className="th-custom text-right">
                                <Sorting title="Status" />
                            </th>
                            <th className="th-custom text-right"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {socialProfiles.map((contact) => (
                            <Row item={contact} key={contact.id} />
                        ))}
                    </tbody>
                </table>
            )}
            <TablePagination />
        </Layout>
    );
};

export default ContactsV1Page;
