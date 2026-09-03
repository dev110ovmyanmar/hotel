import { Card, Col, Row } from "antd";
import { CircleCheckIcon } from "lucide-react";
import WarningTable from "./WarningTable";
const IssueAndWarningCard = ({
    preAuditChecksData
}) => {
    const cardDesign = `!shadow-md !m-0 !p-0`;
    return (
        <div className="my-2">
            <Row gutter={16}>
                <Col span={8}>
                    <Card
                        title="Issues()"
                        className={cardDesign}
                    >
                        <div className="flex flex-col justify-center items-center">
                            <CircleCheckIcon className="text-green-500"></CircleCheckIcon>
                            <div>No Blocking Issues Found.</div>
                        </div>
                    </Card>
                </Col>
                <Col span={16}>
                    <Card
                        title="Warning()"
                        className={cardDesign}
                    >
                        <WarningTable warningData={preAuditChecksData?.warnings}/>
                    </Card>
                </Col>
            </Row>
        </div>
    )
}

export default IssueAndWarningCard;