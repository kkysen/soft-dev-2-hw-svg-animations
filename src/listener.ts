import {isFunction} from "./utils";


export interface EventListenerAction {
    
    (event?: Event): any;
    
}

export interface Listener {
    
    then(listener: EventListenerAction): Listener;
    
    attachTo<T extends EventTarget>(target: T, type: string): T;
    
    click<T extends EventTarget>(target: T): T;
    
}

export const newListener = function(listener: EventListenerAction): Listener {
    
    let listeners: EventListenerAction[] = [];
    
    const joinListeners = function(listeners: EventListenerAction[]): EventListenerAction {
        return function(e) {
            e.preventDefault();
            listener(e);
            for (const listener of listeners) {
                listener(e);
            }
        };
    };
    
    const self: Listener = {
        
        then: function(nextListener: EventListenerAction): Listener {
            if (isFunction(nextListener)) {
                listeners.push(nextListener);
            }
            return this;
        },
        
        attachTo: function<T extends EventTarget>(target: T, type: string): T {
            target.addEventListener(type, joinListeners(listeners));
            listeners = [];
            return target;
        },
        
        click: function<T extends EventTarget>(target: T): T {
            return self.attachTo(target, "click");
        },
        
    };
    
    return self;
    
};