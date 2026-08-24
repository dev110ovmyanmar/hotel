import { Card, Divider, Tag } from "antd";
import { MdPeopleOutline } from "react-icons/md";
import PriceTag from "../../component/PriceTag/PriceTag";

const RoomConfirmFinish = ({ roomBookValues }) => {
  return (
    <>
      {roomBookValues?.rooms?.map((i) => (
        <Card className="!my-3">
          <div className="flex justify-between">
            <p>{i?.roomType?.name}</p>
            <Tag color="blue">{i?.totalRooms} Room</Tag>
          </div>

          <div className="flex !m-0 !p-0">
            <MdPeopleOutline fontSize={19} className="mt-1" />
            <span className="text-md ml-1 mt-1">{i.adults}</span>

            {/* <MdOutlineEscalatorWarning className="ml-3" />
                                <span className="ml-1 text-xs">{i.child}</span> */}

            {/* <div className="text-lg text-gray-400 mx-2">|</div> */}
            {/* <div className="!text-md ml-1 mt-1">{i.extraBed} Extra Bed</div> */}
          </div>

          <Divider className="!my-3 !p-0" />

          {i?.ratePlans?.map((rate) => (
            <div className="flex justify-between !m-0 !p-0">
              <p>{rate?.name}</p>
              <div className="flex items-center gap-1 font-bold">
                <PriceTag value={rate?.totalPrice} />
                <span>MMK</span>
              </div>
            </div>
          ))}

          <Divider className="!my-3 !p-0" />

          <div className="flex justify-between">
            <p>Incentive</p>

            <div className="flex items-center gap-1 font-bold text-red-500">
              - <PriceTag value={i?.incentiveTotal} />
              <span>MMK</span>
            </div>
          </div>

          <div className="flex justify-between">
            <p>Tax</p>
            <div className="flex items-center gap-1 font-bold">
              <PriceTag value={i?.taxTotal} />
              <span>MMK</span>
            </div>
          </div>
        </Card>
      ))}
    </>
  );
};

export default RoomConfirmFinish;
