export function playDestroyAnimationFromNode(node: cc.Node): Promise<void> {
    return new Promise(resolve => {
        cc.tween(node)
            .to(0.2, { scale: 0.2, opacity: 0 })
            .call(() => {
                node.destroy();
                resolve();
            })
            .start();
    });
}

export function playMovingAnimationFromNode(node: cc.Node, toPosition: cc.Vec2): Promise<void> {
    return new Promise(resolve => {
        cc.tween(node)
            .to(0.2, { position : cc.v3(toPosition.x, toPosition.y, 0) }, { easing: "quadInOut" })
            .call(resolve)
            .start();
    });
}