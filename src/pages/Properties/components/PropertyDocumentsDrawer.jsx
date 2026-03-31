import { Drawer, Row, Col } from "antd";
import { getPropertyDetails, propertyUpload } from "../../../api/propertyApi";
import { useApiMutation } from "../../../hooks/useApiMutation";
import ImageUploadCard from "../../../component/ImageUploadCard/ImageUploadCard";
import useApiQuery from "../../../hooks/useApiQuery";

const PropertyDocumentsDrawer = ({ open, onClose, property }) => {
  const { data } = useApiQuery({
    fetchQueryName: "properties_details",
    fetchQueryFunction: getPropertyDetails,
    params: { uuid: property?.uuid },
    options: {
      enabled: !!property?.uuid,
    },
  });

  const uploadMutation = useApiMutation({
    mutationFn: propertyUpload,
    invalidateKeys: [["properties_details", property?.uuid]],
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
      {/* Property Icon */}
      <Row justify="center" gutter={[64, 64]}>
        <Col>
          <ImageUploadCard
            label="Logo"
            type="property_icon"
            property={property}
            uploadMutation={uploadMutation}
            imageUrl={data?.file}
            size="large"
          />
        </Col>
      </Row>

      {/* Email + Login Photos */}
      <Row gutter={[32, 32]} justify="center" style={{ marginTop: 40 }}>
        <Col span={10}>
          <ImageUploadCard
            label="Email Logo"
            type="email_photo"
            property={property}
            uploadMutation={uploadMutation}
            imageUrl={getFile("email_photo")}
          />
        </Col>

        <Col span={10}>
          <ImageUploadCard
            label="Login Logo"
            type="login_photo"
            property={property}
            uploadMutation={uploadMutation}
            imageUrl={getFile("login_photo")}
          />
        </Col>
      </Row>
    </Drawer>
  );
};

export default PropertyDocumentsDrawer;