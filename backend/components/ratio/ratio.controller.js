import RatioModel from './ratio.model.js';

export const getRatios = async (req, res) => {
    const ratios = await RatioModel.find();
        res.send(ratios);
}

export const getRatio = async (req, res) => {
    let ratio = await RatioModel.findById(req.params.id);

    if(!ratio){
        return res.send({ message: 'This ratio doesn\'t exist' });
    }
    res.send(ratio);
}

export const createRatio = async(req, res) => {
    const body = req.body;
    const from = body.from.toUpperCase()
    const to = body.to.toUpperCase()
    const name = from+"->"+to
    const reverseName = to+"->"+from
    let ratio = await RatioModel.findOne({name: name});

    if(ratio){
        return res.send({ success: false, message: 'Ratio already exist!' });
    }

    const newBody = { "name": name, "from": from, "to": to, "ratio": body.ratio }

    const reverseRatio = (1 / body.ratio).toFixed(4)
    const newReverseBody = { "name": reverseName, "from": to, "to": from, "ratio": reverseRatio }
    const newRatio = new RatioModel(newBody);
    const newReverseRatio = new RatioModel(newReverseBody);

    await newRatio.save();
    await newReverseRatio.save();

    res.status(201).json({ success: true, data: newRatio });
}

export const deleteRatio = async (req, res) =>{
    const ratio = await RatioModel.findById(req.params.id);

    if(!ratio){
        return res.send({ message: 'This ratio doesn\'t exist' });
    }

    const reverseName = ratio.to+"->"+ratio.from
    const reverseRatio = await RatioModel.findOne({name: reverseName})
    const name = ratio.name;

    await RatioModel.findByIdAndDelete(req.params.id);
    await RatioModel.findByIdAndDelete(reverseRatio._id);
    res.status(201).send("Ratio "+name+" and "+reverseName+" was deleted!");
}

export const updateRatio = async (req, res) =>{
    const ratio = await RatioModel.findById(req.params.id);
    const updates = req.body

    if(!ratio){
        return res.send({ message: 'This ratio doesn\'t exist' });
    }

    await RatioModel.findByIdAndUpdate(req.params.id, updates, {new: true})
    const updatedRatio = await RatioModel.findById(req.params.id);
    res.send({ message: 'Ratio '+ ratio.name +' updated!', updatedRatio});
}
