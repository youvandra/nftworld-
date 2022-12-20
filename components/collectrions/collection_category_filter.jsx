import React, { useState } from "react";
import Recently_added_dropdown from "../dropdown/recently_added_dropdown";
import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel,
} from "react-accessible-accordion";

const Collection_category_filter = () => {
  const [propertiesModal, setPropertiesModal] = useState(false);
  const [propetiesAccordionValue, setPropetiesAccordionValue] = useState(null);

  const handlePropartiesAccordion = (parentId, e) => {
    setPropetiesAccordionValue(parentId);
    const target = e.target.closest(".accordion-item");
    target.classList.toggle("show-accordion");
  };

  const sortText = [
    {
      id: 1,
      text: "Recently Added",
    },
    {
      id: 2,
      text: "Price: Low to High",
    },
    {
      id: 3,
      text: "Price: high to low",
    },
  ];

  const categoryText = [
    {
      id: 1,
      text: "All",
    },
    {
      id: 2,
      text: "Art",
    },
    {
      id: 3,
      text: "Collectibles",
    },
    {
      id: 4,
      text: "Domain",
    },
    {
      id: 5,
      text: "Music",
    },
    {
      id: 6,
      text: "Photography",
    },
    {
      id: 7,
      text: "Virtual World",
    },
  ];
  const saleTypeText = [
    {
      id: 1,
      text: "Any",
    },
    {
      id: 2,
      text: "Listed",
    },
    {
      id: 3,
      text: "Not for sale",
    },
  ];

  return (
    <>
      {/* <!-- Filter --> */}
      <div className="mb-8 flex flex-wrap items-center justify-between">
        <div className="flex flex-wrap items-center">
          {/* <!-- Category --> */}
          <Recently_added_dropdown data={categoryText} dropdownFor="category" />

          {/* <!-- Sale Type --> */}
          <Recently_added_dropdown
            data={saleTypeText}
            dropdownFor="sale-type"
          />

          {/* <!-- Price Range --> */}
          <Recently_added_dropdown dropdownFor="price-range" />
        </div>

        {/* <!-- Sort --> */}
        <Recently_added_dropdown data={sortText} dropdownFor="sort" />
      </div>
    </>
  );
};

export default Collection_category_filter;
