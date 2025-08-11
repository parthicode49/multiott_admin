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
import * as Action from "../../actions/offer";
import { all_distributor_list } from "../../actions/distributor";
import InfoIcone from "../../images/info.png";
import { bindActionCreators } from "redux";
import Popup from "../utils/Popup";

export default function Offers() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.layout.profile);
  const [form, setForm] = useState({});
  const [isEdit, setIsEdit] = useState(false);
  const { offer_update, offer_create } = bindActionCreators(Action, dispatch);
  const [openPopup, setOpenPopup] = useState(false);
  const [save, setSave] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState();
  const [contentPopup, setContentPopup] = useState("");
  const offer_list = useSelector((state) => state?.offer?.offer_list);
  const [result, setResult] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("");
  const handleOpen = () => setOpen(true);
  const tempTableData = {
    tableTitle: "Offers",
    deleteRecord: Action.offer_delete,
    updateRecord: Action.offer_status_update,
    deleteAccess: "true",
    onDeleteText: "Are you sure want to delete?",
    onUpdateText: "Are you Sure?",
    tableHead: [
      {
        id: "offer_title",
        label: "Offer Title",
      },
      {
        id: "offer_code",
        label: "Code",
      },
      {
        id: "plan_name",
        label: "Plan",
      },
      {
        id: "image",
        label: "Image",
        isImage: true,
      },

      {
        id: "sequence",
        label: "Sequence",
      },
      {
        id: "expiry_date",
        label: "Expiry Date",
      },
     {
        id: "status",
        label: "Status",
        // isButtonDisplay: true
      },
       {
        id: "edit",
        label: "Update",
        // access: rights?.["Distributor"]?.["edit"] == "true",
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
          type: "inputBox",
          name: "offer_title",
          title: "Title",
          placeholder: "Type Offer Title",
          required: true,
        },
        {
          type: "inputBox",
          name: "offer_code",
          title: "Code",
          placeholder: "Type Code",
          required: true,
          isCaps : true
        },
        {
          type: "inputBox",
          name: "company_name",
          title: "Company Name",
          placeholder: "Type Company Name",
          required: true,
        },
        {
          type: "inputBox",
          name: "redirection_link",
          title: " Redirection Link",
          placeholder: "Paste Link",
          // required: true,
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
          title: "Expire Date",
          min: new Date().toISOString().split("T")[0],
          name: "expiry_date",
          default: new Date().toISOString().split("T")[0],
          required: true,
          placeholder: "Select Expire Date",
          // size: "3",
        },
        {
          type: "inputBox",
          name: "sequence",
          title: "Sequence",
          display: "none",
          regex: /^[0-9\.]+$/,
          // maxLength: "2",
          // size: "3",
          placeholder: "Type Sequence",
          required: true,
        },
        {
          type: "image",
          name: "image",
          title: "Offer Image",
          description: "Image size",
          image_size: "1920 * 1080 PX",
          accept: "image/*",
          size: 4,
          required: true,
        },
        {
          type: "inputBox",
          title: "Offer Description",
          placeholder: "Type Offer Description",
          name: "description",
          // required: true,
          size: "12",
          isLimit: "Description",
          showLimit: true,
          maxLength: "500",
          row: "4",
          multiline: true,
        },
      ],
    },
  ]);

  const subscriptions = useSelector(
    (state) => state.subscriptions.subscriptions
  );
  useEffect(() => {
    dispatch(Action.offer_list_admin());
  }, [save]);
  useEffect(() => {
    dispatch(all_subscription_list());
  }, [user?.id]);

  const formTitle = isEdit ? "Edit PROMOCODE" : "Create PROMOCODE";
  console.log(offer_list,"DSFDSFSDF")
  useEffect(() => {
    if (offer_list?.data) {
      const temp = tableData;
      temp.tableBody = offer_list?.data || [];
      setTableData({ ...temp });
    }
  }, [offer_list]);

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
              if (index == 6) {
                return {
                  ...field,
                  display: "block",
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
              if (index == 6) {
                return {
                  ...field,
                  display: "none",
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
      const resData = await offer_update(data);
      if (resData?.status === 200) {
        setForm({});
        setSave(!save);
        setDrawer(false);
      } else {
        setForm({ ...form });
      }
    } else {
      const resData = await offer_create(data);
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
        formTitle={isEdit ? "Edit Offer" : "Add Offer"}
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
