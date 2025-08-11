import { useSelector } from "react-redux";

export const TableData = () => {
  const rights = useSelector((state) => state.layout.rights);
  const role = useSelector((state) => state.layout.role);

  return {
    tableTitle: "Series",
    deleteAccess: rights?.["Web Series"]?.["delete"] == "true",
    tableHead: [
      {
        id: "thumbnail",
        label: "Image",
        isFirstImage: true,
      },
      {
        id: "title",
        label: "Series Name",
        subText: "episode_data",
        link: "details",
        // color:"#4267B2"
      },
      {
        id: "sequence",
        label: "Sequence",
      },
      // {
      //   id: "episode_count",
      //   label: "Episodes",
      //   // subText: "distributor_name",
      // },
      {
        id: "ott_name",
        label: "Ott",
      },
      // {
      //   id: 'series_type',
      //   label: 'Access Type',
      // },
      {
        id: "category_name",
        label: "Category",
        subText: "sub_category_name",
      },
      {
        id: "language_name",
        label: "Language",
      },

      {
        id: "series_view",
        label: "View",
      },
      // {
      //   id: 'content_advisory',
      //   label: 'Content Type',
      // },
      {
        id: "status",
        label: "Status",
        // isButtonDisplay: true
      },
      {
        id: "info",
        label: "View",
        isSpecial: true,
        align: "left",
      },
      {
        id: "notification",
        label: "Notification",
        isSpecial: true,
        align: "center",
      },
      {
        id: "edit",
        label: "Update",
        access: rights?.["Distributor"]?.["edit"] == "true",
        isNewForm: true,
      },
      // role !== "Distributor" &&    {
      //   id: 'edit',
      //   label: 'Update',
      //   access: rights?.["Web Series"]?.["edit"] == "true"
      // },
    ],
    tableBody: [],
    filterColumn: [
      // {
      //   id: "1",
      //   title: "Access Type",
      //   name: "series_type",
      //   options: ["FREE", "TVOD", "SVOD"],
      // },
      {
        id: "2",
        title: "Language",
        name: "language",
        options: ["English", "Hindi", "Gujarati"],
      },

      {
        id: "3",
        title: "Category",
        name: "category",
        options: ["Action", "Comedy", "Drama", "Horror"],
      },
      {
        id: "4",
        title: "Sub Category",
        name: "series_subcategory",
        options: ["Action", "Comedy", "Drama", "Horror"],
        displayOn: "category",
        dependentField: "category",
        requredField: "subcategory_name",
      },
      {
        id: "3",
        title: "Ott",
        name: "ott_name",
        options: ["In House", "Content Owner"],
      },
      {
        id: "5",
        title: "Status",
        name: "status",
        options: ["Active", "Inactive"],
      },
    ],
  };
};
