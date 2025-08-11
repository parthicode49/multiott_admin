import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as Action from "../../actions/adbanner";
import { bindActionCreators } from "redux";
import ListTable from "../utils/Table";
import Export from "../utils/Export";

const AdBanner = () => {
  const dispatch = useDispatch();
  const [form, setForm] = useState({});
  const [isEdit, setIsEdit] = useState(false);
  const user = useSelector((state) => state.layout.profile);
  const [save, setSave] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const series = useSelector((state) => state?.webseries?.series_name);
  const movie = useSelector((state) => state?.movies?.movie_name);
  const { advertisement_banner_create, advertisement_banner_update } =
    bindActionCreators(Action, dispatch);
  const add_banner = useSelector((state) => state?.addbanner?.ad_banner);
  console.log(add_banner, "sdfdsfdsfsdf");
  const [tableData, setTableData] = useState({
    tableTitle: "Advertisement Banner",
    deleteRecord: Action.advertisement_banner_delete,
    updateRecord: Action.advertisement_banner_status_update,
    customisedStatusUpdateMessage: true,
    onDeleteText: "Are you sure want to delete ?",
    onActiveText: "Are you Sure want to Activate Ad Banner?",
    onInactiveText: "Are you Sure want to Inactivate Ad Banner?",
    tableHead: [
      {
        id: "advertisement_name",
        label: "Title",
      },
      //   {
      //     id: "title",
      //     label: "Title",
      //   },

      {
        id: "image",
        label: "Image",
        isImage: true,
      },
      // {
      //   id: "web_banner",
      //   label: "Web View",
      //   isImage: true,
      // },

      {
        id: "expiry_date",
        label: "Expiry Date",
        isDate: true,
      },
      {
        id: "created_at",
        label: "Created At",
        isDate: true,
      },
      {
        id: "status",
        label: "Status",
      },
      {
        id: "edit",
        label: "Update",
        isNewPopUpForm: true,
      },
    ],
    tableBody: [],
    filterColumn: [
      //   {
      //     id: "2",
      //     title: "Content Type",
      //     name: "content_type",
      //     options: ["Movie", "Series"],
      //   },
    ],
  });

  useEffect(() => {
    if (user?.id) {
      const data = new FormData();
      data.append("id", user?.id);
      data.append("user", user?.id);
      dispatch(Action.all_advertisement_banner_list(data));
    }
  }, [user?.id, save]);
  const [formStructure, setFormStructure] = useState([
    {
      type: "inputBox",
      name: "advertisement_name",
      title: "Title",
      placeholder: "Type Title",
      required: true,
    },
    {
      type: "inputBox",
      name: "redirection_link",
      title: "Redirection Link",
      placeholder: "Paste Link",
      required: true,
    },
    {
      type: "date",
      variant: "date",
      title: "Expiry Date",
      min: new Date().toISOString().split("T")[0],
      name: "expiry_date",
      default: new Date().toISOString().split("T")[0],
      required: true,
      placeholder: "Select Expire Date",
      // size: "3",
    },
    {
      type: "file",
      name: "image",
      title: "Image",
      description: "Image size",
      image_size: "1600 * 900 PX",
      accept: "image/*",
      size: 6,
      required: true,
    },
  ]);
  useMemo(() => {
    if (add_banner?.data) {
      const temp = tableData;
      temp.tableBody = add_banner?.data;
      setTableData({ ...temp });
      // setForm({ ...form, sequence: Number(tableData.tableBody[tableData.tableBody.length - 1]?.["sequence"]) + 1 })
    }
  }, [add_banner]);

  const handleSubmit = async (event) => {
    const data = new FormData();
    Object.keys(form)?.map((key) => data.append(key, form?.[key]));
    data.append("user", user?.id);
    if (isEdit) {
      const resData = await advertisement_banner_update(data);
      if (resData?.status === 200) {
        setForm({});
        setSave(!save);
        setIsModalOpen(false);
      } else {
        setForm(form);
      }
    } else {
      const resData = await advertisement_banner_create(data);
      if (resData?.status === 200) {
        // setForm({});
        setForm({});
        setSave(!save);
        setIsModalOpen(false);
      } else {
        setForm(form);
      }
    }
  };

  return (
    <ListTable
      tableData={tableData}
      key={"ListTable"}
      form={form}
      setForm={setForm}
      setTableData={setTableData}
      setIsEdit={setIsEdit}
      view="view_all"
      save={save}
      setSave={setSave}
      isModalOpen={isModalOpen}
      setIsModalOpen={setIsModalOpen}
      isPopUpNewTable={true}
      formStructure={formStructure}
      formTitle={isEdit ? "Edit Top Ten Video" : "Add Top Ten Video"}
      onSubmit={handleSubmit}
      initialData={editingIndex !== null ? tableData[editingIndex] : {}}
      exportButton={
        <Export
          fileName={"Category"}
          isClubed={true}
          access={"true"}
          exportData={tableData?.exportData || tableData?.tableBody}
          headings={tableData.tableHead?.map((value) => value.label)}
          // api = {"export_episode_list"}
          // api_data = {episodes?.filter_condition}
        />
      }
      // setForm = {se}
      // setIsEdit(true)
    />
  );
};
export default AdBanner;
