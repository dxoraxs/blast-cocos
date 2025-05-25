export function playDestroyAnimationFromNode(node: cc.Node): Promise<void> {
    return new Promise(resolve => {
        cc.tween(node)
            .to(0.2, { scale: 0.2, opacity: 0 })
            .call(() => {
                resolve();
            })
            .start();
    });
}

export function playMovingAnimationFromNode(node: cc.Node, fromPosition: cc.Vec3, toPosition: cc.Vec3): Promise<void> {
    node.setPosition(fromPosition);
    return new Promise(resolve => {
        cc.tween(node)
            .to(0.2, { position : toPosition }, { easing: "quadInOut" })
            .call(resolve)
            .start();
    });
}