import { Progress } from 'react-sweet-progress';
import "react-sweet-progress/lib/style.css";
import { FC, useState } from 'react'
import { ISingleMovePlayer, ProgressUpdatedEvent } from './app/players/PlayerInterface';

interface ProgressBarProps {
    player: ISingleMovePlayer
}

const MoveProgressBar: FC<ProgressBarProps> = ({ player }) => {

    const [progress, setProgress] = useState(0);

    player?.useProgressHandler((e: ProgressUpdatedEvent) => {
        setProgress(e.detail);
    })

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
