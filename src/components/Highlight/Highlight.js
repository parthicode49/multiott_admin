import React from "react";
import { useState, useMemo, useEffect } from "react";
import ListTable from "../utils/Table";
// import {
//   coupon_create,
//   coupon_delete,
//   coupon_update,
//   all_coupon_list,
//   movie_list_for_promocode,
//   series_list_for_promocode,
// } from "../../actions/coupon";
import { all_subscription_list } from "../../actions/subscription";
import { useDispatch, useSelector } from "react-redux";
import Export from "../utils/Export";
import { useLocation, useNavigate } from "react-router-dom";
import EnlargedView from "../utils/EnlargedView";
import dayjs from "dayjs";
import * as Action from "../../actions/highlight";
import { all_distributor_list } from "../../actions/distributor";
import InfoIcone from "../../images/info.png";
import { bindActionCreators } from "redux";
import Popup from "../utils/Popup";
import { only_series_name } from "../../actions/WebSeries/series";
import { all_movie_name_list } from "../../actions/Movie/movie";

export default function Highlight() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.layout.profile);
  const [form, setForm] = useState({});
  const [isEdit, setIsEdit] = useState(false);
  const { highlight_create, highlight_update } = bindActionCreators(
    Action,
    dispatch
  );
  const [openPopup, setOpenPopup] = useState(false);
  const [save, setSave] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState();
  const [contentPopup, setContentPopup] = useState("");
  const highlight = useSelector((state) => state?.highlight?.highlights);
  const [result, setResult] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("");
  const series = useSelector((state) => state?.webseries?.series_name);
  const movie = useSelector((state) => state?.movies?.movie_name);
  const handleOpen = () => setOpen(true);
  const tempTableData = {
    tableTitle: "Highlight",
    deleteRecord: Action.highlight_delete,
    updateRecord: Action.highlight_status_update,
    deleteAccess: "true",
    onDeleteText: "Are you sure want to delete?",
    onUpdateText: "Are you Sure?",
    tableHead: [
      {
        id: "highlight_type",
        label: "HIghlight Title",
      },
      {
        id: "name",
        label: "Name",
      },
      {
        id: "poster",
        label: "Image",
        isImage: true,
      },

      {
        id: "start_date",
        label: "Start Date",
        isDate : true
      },
      {
        id: "end_date",
        label: "End Date",
        isDate : true
      },
      {
        id: "status",
        label: "Status",
        // isButtonDisplay: true
      },
       {
        id: "edit",
        label: "Update",
       
        isNewForm: true,
      },
    ],
    tableBody: [],
    filterColumn: [
      {
        id: "1",
        title: "Status",
        name: "status",
        options: ["Active", "Inactive", "Expired"],
      },
    ],
  };
  const [tableData, setTableData] = useState({ ...tempTableData });
  const [formStructure, setFormStructure] = useState([
    {
      title: "Details",
      fields: [
        {
          type: "select",
          name: "highlight_type",
          title: "Highlight Type",
          placeholder: "Select Highlight Type",
          options: [
            { value: "Image", label: "Image" },
            { value: "Movie", label: "Movie" },
            { value: "Series", label: "Series" },
            { value: "Plan", label: "Plan" },
          ],
          required: true,
        },
        {
          type: "select",
          name: "plan",
          title: "Plan",
          placeholder: "Select Plan",
          options: [],
          required: true,
        },
        {
          type: "date",
          variant: "date",
          title: "Start Date",
          min: new Date().toISOString().split("T")[0],
          name: "start_date",
          default: new Date().toISOString().split("T")[0],
          required: true,
          placeholder: "Select Start Date",
          // size: "3",
        },
        {
          type: "date",
          variant: "date",
          title: "End Date",
          min: new Date().toISOString().split("T")[0],
          name: "end_date",
          default: new Date().toISOString().split("T")[0],
          required: true,
          placeholder: "Select End Date",
          // size: "3",
        },

        {
          type: "image",
          name: "poster",
          title: "Poster Image",
          description: "Image size",
          image_size: "1920 * 1080 PX",
          accept: "image/*",
          size: 4,
          required: true,
        },
      ],
    },
  ]);

  const subscriptions = useSelector(
    (state) => state.subscriptions.subscriptions
  );
  useEffect(() => {
    dispatch(Action.all_highlight_list());
  }, [save]);
  useEffect(() => {
    dispatch(all_subscription_list());
    dispatch(only_series_name());
    // dispatch(all_season_list(data))
    dispatch(all_movie_name_list());
  }, [user?.id]);

  const formTitle = isEdit ? "Edit PROMOCODE" : "Create PROMOCODE";
  console.log(highlight , "DSFDSFSDF");
  useEffect(() => {
    if (highlight?.data) {
      const temp = tableData;
      temp.tableBody = highlight?.data || [];
      setTableData({ ...temp });
    }
  }, [highlight]);
  useEffect(() => {
    if (form?.highlight_type === "Plan") {
      setFormStructure((prevFormStructure) =>
        prevFormStructure.map((section) => {
          if (section.title === "Details") {
            const updatedFields = section.fields.map((field, index) => {
              if (index === 1) {
                return {
                  ...field,
                  display: "block",
                  title: "Plan",
                  placeholder: "Select Plan",
                  name: "plan",
                  options: subscriptions?.data?.map((ele) => ({
                    label: ele?.plan_name,
                    value: ele?.id,
                  })),
                };
              }
              return field;
            });
            return { ...section, fields: updatedFields };
          }
          return section;
        })
      );
    } else if (form?.highlight_type === "Movie") {
      setFormStructure((prevFormStructure) =>
        prevFormStructure.map((section) => {
          if (section.title === "Details") {
            const updatedFields = section.fields.map((field, index) => {
              if (index === 1) {
                return {
                  ...field,
                  display: "block",
                  title: "Movie",
                  placeholder: "Select Movie",
                  name: "movie",
                  options: movie?.data
                    ?.map((ele) => ({
                      label: ele?.title,
                      value: ele?.id,
                    }))
                    .filter((e) => e),
                };
              }
              return field;
            });
            return { ...section, fields: updatedFields };
          }
          return section;
        })
      );
    } else if (form?.highlight_type === "Series") {
      setFormStructure((prevFormStructure) =>
        prevFormStructure.map((section) => {
          if (section.title === "Details") {
            const updatedFields = section.fields.map((field, index) => {
              if (index === 1) {
                return {
                  ...field,
                  display: "block",
                  title: "Series",
                  placeholder: "Select Series",
                  name: "series",
                  options: series?.data
                    ?.map((ele) => ({
                      label: ele?.title,
                      value: ele?.id,
                    }))
                    .filter((e) => e),
                };
              }
              return field;
            });
            return { ...section, fields: updatedFields };
          }
          return section;
        })
      );
    } else {
      setFormStructure((prevFormStructure) =>
        prevFormStructure.map((section) => {
          if (section.title === "Details") {
            const updatedFields = section.fields.map((field, index) => {
              if (index === 1) {
                return { ...field, display: "none" };
              }
              return field;
            });
            return { ...section, fields: updatedFields };
          }
          return section;
        })
      );
    }
  }, [form?.highlight_type, movie, series, subscriptions]);
  useEffect(() => {
    if (subscriptions?.data) {
      setFormStructure((prevFormStructure) =>
        prevFormStructure.map((section) => {
          if (section.title === "Details") {
            const updatedFields = section.fields.map((field, index) => {
              if (index === 4) {
                return {
                  ...field,
                  options: subscriptions?.data?.map((ele) => ({
                    label: ele?.plan_name,
                    value: ele?.id,
                  })),
                };
              }
              return field;
            });
            return { ...section, fields: updatedFields };
          }
          return section;
        })
      );
    }
  }, [subscriptions]);

  useEffect(() => {
    if (isEdit) {
      setFormStructure((prevFormStructure) =>
        prevFormStructure.map((section) => {
          if (section.title === "Details") {
            const updatedFields = section.fields.map((field, index) => {
              if (index == 0) {
                return {
                  ...field,
                  disabled: true,
                };
              }
              return field;
            });
            return { ...section, fields: updatedFields };
          }
          return section;
        })
      );
    } else {
      setFormStructure((prevFormStructure) =>
        prevFormStructure.map((section) => {
          if (section.title === "Details") {
            const updatedFields = section.fields.map((field, index) => {
              if (index == 0) {
                return {
                  ...field,
                  disabled: false,
                };
              }
              return field;
            });
            return { ...section, fields: updatedFields };
          }
          return section;
        })
      );
    }
  }, [isEdit]);

  // const

  const handleSubmit = async (event) => {
    event.preventDefault();

    const data = new FormData();
    Object.keys(form)?.map((key) => data.append(key, form?.[key]));
    if (isEdit) {
      const resData = await highlight_update(data);
      if (resData?.status === 200) {
        setForm({});
        setSave(!save);
        setDrawer(false);
      } else {
        setForm({ ...form });
      }
    } else {
      const resData = await highlight_create(data);
      if (resData?.status === 200) {
        setForm({});
        setSave(!save);
        setDrawer(false);
      } else {
        setForm({ ...form });
      }
    }
  };

  return (
    <>
      <EnlargedView open={open} setOpen={setOpen} content={content} />
      <Popup
        open={openPopup}
        setOpen={setOpenPopup}
        content={contentPopup}
        setResult={setResult}
      />
      <ListTable
        tableData={tableData}
        key={"ListTable"}
        setForm={setForm}
        setTableData={setTableData}
        setIsEdit={setIsEdit}
        save={save}
        setSave={setSave}
        isDrawerForm={true}
        openDrawer={drawer}
        setOpenDrawer={setDrawer}
        formStructure={formStructure}
        handleSubmit={handleSubmit}
        form={form}
        isEdit={isEdit}
        formTitle={isEdit ? "Edit Highlight" : "Add Highlight"}
        exportButton={
          <Export
            fileName={"Offer"}
            isClubed={true}
            access={"true"}
            exportData={tableData?.exportData || tableData?.tableBody}
            headings={tableData.tableHead?.map((value) => value.label)}
            // api = {"export_episode_list"}
            // api_data = {episodes?.filter_condition}
          />
        }
      />
    </>
  );
}
