import { Drawer, Row, Col } from "antd";
import { getPropertyDetails, propertyUpload } from "../../../api/propertyApi";
import { useApiMutation } from "../../../hooks/useApiMutation";
import ImageUploadCard from "../../../component/ImageUploadCard/ImageUploadCard";
import useApiQuery from "../../../hooks/useApiQuery";
import Loader from "../../../component/Loader/Loader";

const PropertyDocumentsDrawer = ({ open, onClose, property }) => {
  const { data, isFetching: propertiesDetailsFetching } = useApiQuery({
    fetchQueryName: "properties_details",
    fetchQueryFunction: getPropertyDetails,
    params: { uuid: property?.uuid },
    options: {
      enabled: !!property?.uuid,
    },
  });

  const uploadMutation = useApiMutation({
    mutationFn: propertyUpload,
    invalidateKeys: [["properties_details", { uuid: property?.uuid }]],
  });

  const getFile = (type) =>
    data?.propertyFiles?.find((f) => f.name === type)?.file;

  return (
    <Drawer
      title={`Manage Documents - ${property?.name || ""}`}
      size={550}
      open={open}
      onClose={onClose}
      destroyOnHidden
    >
      {
        propertiesDetailsFetching
          ?
          <div className="flex items-center justify-center h-full min-h-[300px]">
            <Loader />
          </div>
          :
          <>
            <ImageUploadCard
              label="Logo"
              type="property_icon"
              property={property}
              uploadMutation={uploadMutation}
              imageUrl={data?.file}
              smallSizes={true}

            />

            <ImageUploadCard
              label="Email Letterhead"
              type="email_photo"
              property={property}
              uploadMutation={uploadMutation}
              imageUrl={getFile("email_photo")}
            />

            <ImageUploadCard
              label="Login Background Photo"
              type="login_photo"
              property={property}
              uploadMutation={uploadMutation}
              imageUrl={getFile("login_photo")}
            />
          </>
      }


    </Drawer>
  );
};

export default PropertyDocumentsDrawer;