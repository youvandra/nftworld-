import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import Explore_collection_item from "../../components/collectrions/explore_collection_item";
import { collectCollectionData } from "../../redux/counterSlice";
import { useDispatch } from "react-redux";
import UserCard from "../../components/UserCard";

export default function index() {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [collections, setCollections] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(collectCollectionData(collections));
  }, [dispatch, collectCollectionData, collections]);

  const getSearchResult = async (s) => {
    const { data } = await axios.get(`/api/search?search=${s}`);
    if (!data?.users || !data?.collections) return;
    const formatedCollections = data.collections.map(
      ({ creator, ...rest }) => ({
        userName: creator?.name,
        userImage: creator?.profilePhoto,
        ...rest,
      })
    );
    setCollections(formatedCollections);
    setUsers(data.users);
  };

  const [itemsTabs, setItemsTabs] = useState(1);

  const collectionItemsTabs = [
    {
      id: 1,
      text: "Collections",
      icon: "collection",
    },
    {
      id: 2,
      text: "Users",
      icon: "user",
    },
  ];

  useEffect(() => {
    if (!router.query.search) return;
    getSearchResult(router.query.search);
  }, [router]);
  return (
    <div className="pt-[5.5rem] lg:pt-24 container">
      <h1 className="mt-8 mb-12 text-center text-5xl font-bold">Search</h1>
      <Tabs className="tabs">
        <TabList className="nav nav-tabs dark:border-jacarta-600 border-jacarta-100 mb-12 flex items-center justify-center border-b">
          {collectionItemsTabs.map(({ id, text, icon }) => {
            return (
              <Tab
                className="nav-item"
                key={id}
                onClick={() => setItemsTabs(id)}
              >
                <button
                  className={
                    itemsTabs === id
                      ? "nav-link hover:text-jacarta-700 text-jacarta-400 relative flex items-center whitespace-nowrap py-3 px-6 dark:hover:text-white active"
                      : "nav-link hover:text-jacarta-700 text-jacarta-400 relative flex items-center whitespace-nowrap py-3 px-6 dark:hover:text-white"
                  }
                >
                  <svg className="icon icon-items mr-1 h-5 w-5 fill-current">
                    <use xlinkHref={`/icons.svg#icon-${icon}`}></use>
                  </svg>
                  <span className="font-display text-base font-medium">
                    {text}
                  </span>
                </button>
              </Tab>
            );
          })}
        </TabList>

        <TabPanel>
          <Explore_collection_item />
        </TabPanel>
        <TabPanel>
          <div className="grid grid-cols-1 gap-[1.875rem] md:grid-cols-2 lg:grid-cols-4">
            {users.map((user, i) => (
              <UserCard key={i} {...user} />
            ))}
          </div>
        </TabPanel>
      </Tabs>
    </div>
  );
}
