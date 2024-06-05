import { Progress } from 'react-sweet-progress';
import "react-sweet-progress/lib/style.css";
import { FC } from 'react'

interface ProgressBarProps {
    progress: number
}

const MoveProgressBar: FC<ProgressBarProps> = ({ progress }) => {
    return (
        <Progress
            percent={progress}
            type="circle"
            status="active"
            style={{ width: "40px" }}
        />
    )
}

export default MoveProgressBar;
